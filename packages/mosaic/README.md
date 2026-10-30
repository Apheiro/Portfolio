# @apheiro/mosaic

Animated canvas tiles that open around HTML elements and emit a colored glow. The package contains a browser engine and optional React bindings. It has no Next.js, Mantine, Preact Signals, or CSS framework dependency.

This is an initial extraction (`0.1.0`), not a pixel-identical copy of the prototype. The geometry, distance falloff, center reveal and glow remain; animation state is now per element and rendering is combined into one scheduled canvas draw. Overlapping openings use the smallest resulting tile size rather than competing to mutate the same tile.

## React

```tsx
'use client';
import { MosaicBackground, MosaicProvider, useMosaicElement } from '@apheiro/mosaic/react';

function Card() {
  const [ref, { show, toggle }] = useMosaicElement<HTMLButtonElement>({
    show: { initialState: true, range: 80, minSize: 5 },
    glow: { color: '#a948ff', range: 150, duration: 1500 },
  });
  return <button ref={ref} onClick={toggle} aria-pressed={show}
    style={{ position: 'relative', zIndex: 1 }}>Toggle opening</button>;
}

export function Example() {
  return <MosaicProvider>
    <section style={{ position: 'relative', height: 400, background: '#420069' }}>
      <MosaicBackground size={24} borderColor='#303030' borderRadius={2} />
      <Card />
    </section>
  </MosaicProvider>;
}
```

The parent must have a size and `position: relative`. The canvas is absolutely positioned, fills the parent and ignores pointer events. No stylesheet is required. Control stacking with the canvas `style` prop and your content's `zIndex`; transparent openings reveal whatever is behind the canvas.

Use one provider per canvas. Providers may be nested. A standalone `<MosaicBackground />` also works without a provider when no element hooks are needed. The hook returns a ref plus `{ show, open, close, toggle, refresh }`. Attach the ref to one HTML element; call `refresh()` after layout changes that neither resize nor scroll, such as translating a closed target. `show.initialState` is read once. Other options update without remounting. `useAnimateElement` and `MosaicBackgroundProvider` are compatibility aliases.

## Browser engine (without React)

```js
import { createMosaic } from '@apheiro/mosaic';

// Give the canvas a CSS width and height independently of its backing resolution.
const mosaic = createMosaic(document.querySelector('canvas'), { size: 24 });
const target = mosaic.registerElement(document.querySelector('.card'), {
  show: { initialState: true },
  glow: { color: '#46e6b1' },
});

target.close();
target.open();
target.update({ show: { range: 120 } });
mosaic.update({ size: 32, borderRadius: 4 });
mosaic.refresh();

// When the element is removed:
target.destroy();
// When the entire canvas is removed:
mosaic.destroy();
```

Both entry points can be imported during SSR. Create the engine only in a browser, after the canvas is mounted. React handles creation and cleanup, including StrictMode remounts.

## Options

Distances use CSS pixels and timings use milliseconds. Colors accept hex, RGB and HSL strings supported by `colord` (not CSS variables or named colors).

| Canvas option | Default | Behavior |
| --- | --- | --- |
| `size` | `30` | Positive tile size. |
| `backgroundColor` | `#000000` | Tile fill. |
| `borderColor` | `#1c1c1c` | Resting border. |
| `borderRadius` | `0` | Corner radius, limited to half the current tile size. |
| `revealDuration` | `500` | Center reveal; `0` makes it immediate. |
| `pixelRatio` | screen ratio, capped at `2` | Canvas backing resolution; explicit values must be positive. |
| `respectReducedMotion` | `true` | Immediate openings and static glow when reduced motion is requested. |

| Element option | Default | Behavior |
| --- | --- | --- |
| `show.initialState` | `false` | Initial opening state. |
| `show.range` | `80` | Falloff outside the target. |
| `show.minSize` | `5` | Tile size at the start of the falloff. Tiles inside the target disappear. |
| `show.duration` | `600` | Opening/closing duration; `0` makes it immediate. |
| `show.delay` | `0` | Delay before opening. Closing is immediate to start. |
| `glow` | absent | Enable a repeating glow when the opening completes. |
| `glow.color` | `#a948ff` | Glow color. |
| `glow.range` | `150` | Distance outside the element affected by the glow. |
| `glow.duration` | `1500` | One tile's rise and fade; must be positive. |
| `glow.loopDelay` | `0` | Gap between pulses. |
| `glow.delay` | `150` | Base spatial delay, increasing up to 10× at the outer edge. |

Each glow cycle includes the full per-tile duration plus the outermost spatial delay, followed by `loopDelay`. The wave returns completely to the resting border color before repeating.

Options are validated. Engine updates merge canvas options; element updates replace element options, restoring unspecified defaults. Destroy methods are idempotent. Destroying an instance cancels its animations and pending draw, disconnects its ResizeObserver, and removes its listeners. No permanent render loop runs when idle.

The engine measures elements relative to the canvas. It observes canvas/target sizes and scroll events from any ancestor, including custom scrolling containers. Axis-aligned CSS scaling is supported; rotated or skewed canvases are not. There is no layout observer for arbitrary position-only changes; use `refresh()` for those. Modern browsers with Canvas 2D, ResizeObserver, matchMedia and requestAnimationFrame are required.

## Build and use outside this repository

```sh
# From the repository root:
pnpm install
pnpm build:mosaic
pnpm test:mosaic
pnpm --filter @apheiro/mosaic pack --pack-destination ./artifacts

# In a separate application:
pnpm add /absolute/path/to/apheiro-mosaic-0.1.0.tgz
```

The tarball contains compiled ESM and TypeScript declarations. React is an optional peer dependency: only consumers of `@apheiro/mosaic/react` need React 18 or 19. CommonJS output is not included. Use a bundler or native Node ESM; browser consumers need dependency resolution through a bundler/import map.

Run `pnpm dev` at the repository root and visit `/mosaic-demo` for two independent React instances, runtime configuration, container resize and mount/unmount controls. Run `pnpm test:browser` for desktop/mobile interaction and lifecycle checks. To use a system Chromium, set `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH`; otherwise install Playwright Chromium with `pnpm exec playwright install chromium`.

Before publishing publicly, choose a license, confirm the package name is available, and review the visual behavior in your target apps. This extraction does not publish anything to npm.
