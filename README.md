# Portfolio + Mosaic

The portfolio consumes the local `@apheiro/mosaic` workspace package. The canvas implementation is isolated from Next.js, custom scrolling, UnoCSS, Mantine and the portfolio's components.

- [`packages/mosaic`](packages/mosaic/README.md): browser engine, React bindings, typed API and packaging instructions.
- [`src/app/mosaic-demo/page.tsx`](src/app/mosaic-demo/page.tsx): two independent instances with size, container resize and mount/unmount controls.
- [`archive`](archive/README.md): preserved unfinished cube and commented DOM implementation, excluded from compilation.

```sh
pnpm install
pnpm dev               # builds the local package, then starts Next.js
pnpm build             # builds the package and portfolio
pnpm typecheck
pnpm test:mosaic       # geometry, isolated state and cleanup
pnpm test:browser      # desktop/mobile interactions and StrictMode cleanup
pnpm test:package      # installs a tarball in a temporary external consumer
```

Open `/` for the portfolio or `/mosaic-demo` for the library example. When editing library source, run `pnpm build:mosaic` again (or `pnpm --filter @apheiro/mosaic exec tsc -p tsconfig.json --watch` in another terminal).

No npm publication is performed by these commands. See the package README to create a tarball and consume it from another project.
