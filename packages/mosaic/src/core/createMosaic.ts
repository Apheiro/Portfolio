import { animate, type JSAnimation } from 'animejs';
import { createTiles, relativeRect } from './geometry.js';
import { resolveElementOptions, resolveOptions } from './options.js';
import {
  drawGrid,
  parseColor,
  type RenderTarget,
} from './renderer.js';
import type {
  MosaicElement,
  MosaicEngine,
  MosaicOptions,
  Tile,
} from './types.js';

interface Entry {
  element: HTMLElement;
  options: ReturnType<typeof resolveElementOptions>;
  state: { progress: number; pulse: number };
  isOpen: boolean;
  disposed: boolean;
  transition?: JSAnimation;
  glow?: JSAnimation;
}

/** Create one independent browser instance. Importing this module is safe during SSR. */
export function createMosaic(
  canvas: HTMLCanvasElement,
  initialOptions: MosaicOptions = {},
): MosaicEngine {
  let options = resolveOptions(initialOptions);
  parseColor(options.backgroundColor);
  parseColor(options.borderColor);
  const canvasContext = canvas.getContext('2d');
  const browserWindow = canvas.ownerDocument.defaultView;
  if (!canvasContext || !browserWindow)
    throw new Error(
      'Mosaic requires a browser canvas with a 2D context.',
    );
  const context = canvasContext;
  const view = browserWindow;
  const entries = new Set<Entry>();
  let tiles: Tile[] = [];
  let width = -1;
  let height = -1;
  let ratio = 0;
  let frame: number | undefined;
  let destroyed = false;
  let rebuild = true;
  const reveal = { progress: 0 };
  let revealAnimation: JSAnimation | undefined;
  const motionQuery = view.matchMedia(
    '(prefers-reduced-motion: reduce)',
  );
  const reducedMotion = () =>
    options.respectReducedMotion && motionQuery.matches;

  function invalidate(): void {
    if (destroyed || frame !== undefined) return;
    frame = view.requestAnimationFrame(render);
  }

  function render(): void {
    frame = undefined;
    if (destroyed) return;
    const nextWidth = canvas.clientWidth;
    const nextHeight = canvas.clientHeight;
    const nextRatio =
      options.pixelRatio ?? Math.min(view.devicePixelRatio || 1, 2);
    if (
      rebuild ||
      width !== nextWidth ||
      height !== nextHeight ||
      ratio !== nextRatio
    ) {
      width = nextWidth;
      height = nextHeight;
      ratio = nextRatio;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      tiles = createTiles(width, height, options.size);
      rebuild = false;
    }
    const canvasRect = canvas.getBoundingClientRect();
    const targets: RenderTarget[] = [];
    for (const entry of entries) {
      if (!entry.element.isConnected) continue;
      targets.push({
        rect: relativeRect(
          entry.element.getBoundingClientRect(),
          canvasRect,
          width,
          height,
        ),
        ...entry.state,
        options: entry.options,
      });
    }
    drawGrid(
      context,
      tiles,
      width,
      height,
      options,
      targets,
      reveal.progress,
    );
  }

  function startGlow(entry: Entry): void {
    entry.glow?.cancel();
    entry.glow = undefined;
    entry.state.pulse = 0;
    if (
      destroyed ||
      entry.disposed ||
      !entry.isOpen ||
      !entry.options.glow
    )
      return;
    if (reducedMotion()) {
      entry.state.pulse = 0.5;
      invalidate();
      return;
    }
    const glow = entry.options.glow;
    entry.glow = animate(entry.state, {
      pulse: [0, 1],
      duration: glow.duration,
      loopDelay: glow.loopDelay,
      loop: true,
      ease: 'linear',
      onUpdate: invalidate,
    });
  }

  function transition(entry: Entry): void {
    entry.transition?.cancel();
    entry.glow?.cancel();
    entry.transition = undefined;
    entry.glow = undefined;
    entry.state.pulse = 0;
    if (destroyed || entry.disposed) return;
    if (reducedMotion() || entry.options.show.duration === 0) {
      entry.state.progress = Number(entry.isOpen);
      startGlow(entry);
      invalidate();
      return;
    }
    entry.transition = animate(entry.state, {
      progress: Number(entry.isOpen),
      duration: entry.options.show.duration,
      delay: entry.isOpen ? entry.options.show.delay : 0,
      ease: 'inOutQuad',
      onUpdate: invalidate,
      onComplete: () => startGlow(entry),
    });
    invalidate();
  }

  const observer = new view.ResizeObserver(invalidate);
  observer.observe(canvas);
  // Capture scroll from any ancestor, including custom scrolling containers.
  canvas.ownerDocument.addEventListener('scroll', invalidate, true);
  view.addEventListener('resize', invalidate);
  function motionChanged(): void {
    revealAnimation?.cancel();
    reveal.progress = 1;
    for (const entry of entries) transition(entry);
    invalidate();
  }
  motionQuery.addEventListener('change', motionChanged);
  if (reducedMotion() || options.revealDuration === 0)
    reveal.progress = 1;
  else
    revealAnimation = animate(reveal, {
      progress: 1,
      duration: options.revealDuration,
      ease: 'linear',
      onUpdate: invalidate,
    });
  invalidate();

  return {
    registerElement(element, elementOptions = {}): MosaicElement {
      if (destroyed)
        throw new Error(
          'Cannot register an element on a destroyed mosaic.',
        );
      if (element.ownerDocument !== canvas.ownerDocument)
        throw new Error(
          'Mosaic elements must share the canvas document.',
        );
      const resolved = resolveElementOptions(elementOptions);
      if (resolved.glow) parseColor(resolved.glow.color);
      const entry: Entry = {
        element,
        options: resolved,
        state: { progress: 0, pulse: 0 },
        isOpen: resolved.show.initialState,
        disposed: false,
      };
      entries.add(entry);
      observer.observe(element);
      if (entry.isOpen) transition(entry);
      const setOpen = (open: boolean) => {
        if (destroyed || entry.disposed || entry.isOpen === open)
          return;
        entry.isOpen = open;
        transition(entry);
      };
      invalidate();
      return {
        get isOpen() {
          return entry.isOpen;
        },
        open: () => setOpen(true),
        close: () => setOpen(false),
        toggle: () => setOpen(!entry.isOpen),
        update(nextOptions) {
          if (destroyed || entry.disposed) return;
          const next = resolveElementOptions(nextOptions);
          if (next.glow) parseColor(next.glow.color);
          if (JSON.stringify(next) === JSON.stringify(entry.options))
            return;
          entry.options = next;
          transition(entry);
        },
        destroy() {
          if (entry.disposed) return;
          entry.disposed = true;
          entry.transition?.cancel();
          entry.glow?.cancel();
          entries.delete(entry);
          if (
            ![...entries].some((other) => other.element === element)
          )
            observer.unobserve(element);
          invalidate();
        },
      };
    },
    update(nextOptions) {
      if (destroyed) return;
      const next = resolveOptions({ ...options, ...nextOptions });
      parseColor(next.backgroundColor);
      parseColor(next.borderColor);
      if (JSON.stringify(next) === JSON.stringify(options)) return;
      options = next;
      rebuild = true;
      motionChanged();
    },
    refresh: invalidate,
    destroy() {
      if (destroyed) return;
      destroyed = true;
      observer.disconnect();
      canvas.ownerDocument.removeEventListener(
        'scroll',
        invalidate,
        true,
      );
      view.removeEventListener('resize', invalidate);
      motionQuery.removeEventListener('change', motionChanged);
      revealAnimation?.cancel();
      for (const entry of entries) {
        entry.disposed = true;
        entry.transition?.cancel();
        entry.glow?.cancel();
      }
      entries.clear();
      if (frame !== undefined) view.cancelAnimationFrame(frame);
      context.clearRect(0, 0, width, height);
    },
  };
}
