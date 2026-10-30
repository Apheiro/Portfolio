import {
  mkdtempSync,
  mkdirSync,
  writeFileSync,
  rmSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = fileURLToPath(new URL('../', import.meta.url));
const consumer = mkdtempSync(join(tmpdir(), 'mosaic-consumer-'));
function run(command, args, cwd = consumer) {
  const result = spawnSync(command, args, {
    cwd,
    encoding: 'utf8',
    stdio: 'inherit',
  });
  if (result.status !== 0)
    throw new Error(`${command} exited with ${result.status}`);
}
try {
  mkdirSync(join(root, 'artifacts'), { recursive: true });
  run(
    'pnpm',
    [
      '--filter',
      '@apheiro/mosaic',
      'pack',
      '--pack-destination',
      join(root, 'artifacts'),
    ],
    root,
  );
  const tarball = resolve(root, 'artifacts/apheiro-mosaic-0.1.0.tgz');
  writeFileSync(
    join(consumer, 'package.json'),
    JSON.stringify({
      name: 'mosaic-external-consumer',
      private: true,
      type: 'module',
    }),
  );
  run('npm', [
    'install',
    '--ignore-scripts',
    '--no-audit',
    '--no-fund',
    tarball,
  ]);
  // No React, Next.js, aliases or workspace configuration in this consumer.
  run('node', [
    '--input-type=module',
    '-e',
    "import { createMosaic } from '@apheiro/mosaic'; if (typeof createMosaic !== 'function') throw Error('Missing core export'); console.log('Standalone core import passed');",
  ]);
  writeFileSync(
    join(consumer, 'ssr.mjs'),
    `
    import assert from 'node:assert/strict';
    import React from 'react';
    import { renderToString } from 'react-dom/server';
    import { MosaicProvider, MosaicBackground } from '@apheiro/mosaic/react';
    const html = renderToString(React.createElement(MosaicProvider, null, React.createElement(MosaicBackground, { size: 24 })));
    assert.match(html, /<canvas/);
    assert.match(html, /aria-hidden="true"/);
    console.log('Standalone React SSR passed');
  `,
  );
  writeFileSync(
    join(consumer, 'example.tsx'),
    `
    import { createMosaic, type MosaicEngine } from '@apheiro/mosaic';
    import { MosaicBackground, MosaicProvider, useMosaicElement } from '@apheiro/mosaic/react';
    function Target() {
      const [ref, { toggle }] = useMosaicElement<HTMLButtonElement>({ glow: { color: '#a948ff' } });
      return <button ref={ref} onClick={toggle}>Toggle</button>;
    }
    export const example = <MosaicProvider><MosaicBackground size={24}/><Target/></MosaicProvider>;
    export const initialize: (canvas: HTMLCanvasElement) => MosaicEngine = createMosaic;
  `,
  );
  for (const version of [18, 19]) {
    run('npm', [
      'install',
      '--ignore-scripts',
      '--no-audit',
      '--no-fund',
      `react@${version}`,
      `react-dom@${version}`,
      'typescript@5',
      `@types/react@${version}`,
      `@types/react-dom@${version}`,
    ]);
    run('node', ['ssr.mjs']);
    run('node', [
      'node_modules/typescript/bin/tsc',
      '--noEmit',
      '--strict',
      '--skipLibCheck',
      '--jsx',
      'react-jsx',
      '--module',
      'NodeNext',
      '--target',
      'ES2020',
      'example.tsx',
    ]);
    console.log(
      `React ${version} SSR and public TypeScript declarations passed`,
    );
  }

  console.log(
    'Tarball consumer and public TypeScript declarations passed',
  );
} finally {
  rmSync(consumer, { recursive: true, force: true });
}
