'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CanvasHTMLAttributes,
  type MutableRefObject,
  type ReactNode,
} from 'react';
import { createMosaic } from '../core/index.js';
import type {
  MosaicElement,
  MosaicElementOptions,
  MosaicEngine,
  MosaicOptions,
} from '../core/index.js';

interface MosaicContextValue {
  engine: MosaicEngine | null;
  attach: (engine: MosaicEngine) => () => void;
}
const MosaicContext = createContext<MosaicContextValue | null>(null);

/** One provider owns one canvas. Nest providers to create independent instances. */
export function MosaicProvider({
  children,
}: { children: ReactNode }) {
  const [engine, setEngine] = useState<MosaicEngine | null>(null);
  const active = useRef<MosaicEngine | null>(null);
  const attach = useCallback((next: MosaicEngine) => {
    if (active.current)
      throw new Error(
        'Use a separate MosaicProvider for each MosaicBackground.',
      );
    active.current = next;
    setEngine(next);
    return () => {
      if (active.current !== next) return;
      active.current = null;
      setEngine(null);
    };
  }, []);
  const value = useMemo(() => ({ engine, attach }), [engine, attach]);
  return (
    <MosaicContext.Provider value={value}>
      {children}
    </MosaicContext.Provider>
  );
}

export interface MosaicBackgroundProps
  extends MosaicOptions,
    Omit<
      CanvasHTMLAttributes<HTMLCanvasElement>,
      keyof MosaicOptions | 'children' | 'width' | 'height'
    > {}

/** Position inside a sized, position:relative container. No external stylesheet required. */
export function MosaicBackground({
  size,
  backgroundColor,
  borderColor,
  borderRadius,
  revealDuration,
  pixelRatio,
  respectReducedMotion,
  style,
  ...canvasProps
}: MosaicBackgroundProps) {
  const context = useContext(MosaicContext);
  const attach = context?.attach;
  const canvas = useRef<HTMLCanvasElement>(null);
  const instance = useRef<MosaicEngine | null>(null);
  const options = useMemo(
    () => ({
      size,
      backgroundColor,
      borderColor,
      borderRadius,
      revealDuration,
      pixelRatio,
      respectReducedMotion,
    }),
    [
      size,
      backgroundColor,
      borderColor,
      borderRadius,
      revealDuration,
      pixelRatio,
      respectReducedMotion,
    ],
  );
  const latestOptions = useRef(options);
  latestOptions.current = options;

  useEffect(() => {
    if (!canvas.current) return;
    const engine = createMosaic(
      canvas.current,
      latestOptions.current,
    );
    instance.current = engine;
    let detach: (() => void) | undefined;
    try {
      detach = attach?.(engine);
    } catch (error) {
      engine.destroy();
      instance.current = null;
      throw error;
    }
    return () => {
      detach?.();
      engine.destroy();
      instance.current = null;
    };
  }, [attach]);
  useEffect(() => {
    instance.current?.update(options);
  }, [options]);

  return (
    // biome-ignore lint/a11y/noAriaHiddenOnFocusable: Decorative canvas; pointer events are disabled and tabIndex is forced to -1.
    <canvas
      {...canvasProps}
      ref={canvas}
      aria-hidden='true'
      tabIndex={-1}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        display: 'block',
        pointerEvents: 'none',
        ...style,
      }}
    />
  );
}

export interface MosaicElementControls {
  show: boolean;
  open(): void;
  close(): void;
  toggle(): void;
  refresh(): void;
}

export function useMosaicElement<
  T extends HTMLElement = HTMLDivElement,
>(
  options: MosaicElementOptions = {},
): [MutableRefObject<T | null>, MosaicElementControls] {
  const context = useContext(MosaicContext);
  if (!context)
    throw new Error(
      'useMosaicElement must be used inside a MosaicProvider.',
    );
  const { engine } = context;
  const element = useRef<T | null>(null);
  const handle = useRef<MosaicElement | null>(null);
  const registeredNode = useRef<T | null>(null);
  const registeredEngine = useRef<MosaicEngine | null>(null);
  const [show, setShow] = useState(
    options.show?.initialState ?? false,
  );
  const latest = useRef({ options, show });
  latest.current = { options, show };

  useEffect(() => {
    if (
      registeredEngine.current === engine &&
      registeredNode.current === element.current
    )
      return;
    handle.current?.destroy();
    handle.current = null;
    registeredNode.current = element.current;
    registeredEngine.current = engine;
    if (!engine || !element.current) return;
    const current = latest.current;
    handle.current = engine.registerElement(element.current, {
      ...current.options,
      show: { ...current.options.show, initialState: current.show },
    });
  });
  useEffect(
    () => () => {
      handle.current?.destroy();
      handle.current = null;
      registeredNode.current = null;
      registeredEngine.current = null;
    },
    [engine],
  );
  // The engine compares normalized values, so inline option objects do not restart animations.
  useEffect(() => {
    handle.current?.update(options);
  });
  useEffect(() => {
    if (show) handle.current?.open();
    else handle.current?.close();
  }, [show, engine]);

  const open = useCallback(() => setShow(true), []);
  const close = useCallback(() => setShow(false), []);
  const toggle = useCallback(() => setShow((value) => !value), []);
  const refresh = useCallback(() => engine?.refresh(), [engine]);
  return [element, { show, open, close, toggle, refresh }];
}

/** Compatibility aliases for the original portfolio integration. */
export {
  MosaicProvider as MosaicBackgroundProvider,
  useMosaicElement as useAnimateElement,
};
export type {
  MosaicOptions,
  MosaicElementOptions,
  MosaicGlowOptions,
} from '../core/index.js';
