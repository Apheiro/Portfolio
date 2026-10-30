/** All distances are CSS pixels; all durations are milliseconds. */
export interface MosaicOptions {
  size?: number;
  backgroundColor?: string;
  borderColor?: string;
  borderRadius?: number;
  /** Duration of the initial grid reveal. Zero disables it. */
  revealDuration?: number;
  /** Defaults to the screen's pixel ratio, capped at 2. */
  pixelRatio?: number;
  /** Honor prefers-reduced-motion. Defaults to true. */
  respectReducedMotion?: boolean;
}

export interface MosaicGlowOptions {
  color?: string;
  range?: number;
  duration?: number;
  loopDelay?: number;
  /** Base tile delay; grows up to ten times this value at the outer edge. */
  delay?: number;
}

export interface MosaicElementOptions {
  show?: {
    initialState?: boolean;
    range?: number;
    /** Minimum tile size in the falloff surrounding the element. */
    minSize?: number;
    duration?: number;
    delay?: number;
  };
  glow?: MosaicGlowOptions;
}

export interface MosaicElement {
  readonly isOpen: boolean;
  open(): void;
  close(): void;
  toggle(): void;
  /** Updates appearance; initialState is only read when registered. */
  update(options: MosaicElementOptions): void;
  destroy(): void;
}

export interface MosaicEngine {
  registerElement(
    element: HTMLElement,
    options?: MosaicElementOptions,
  ): MosaicElement;
  update(options: MosaicOptions): void;
  /** Re-measure after application-driven layout changes. */
  refresh(): void;
  destroy(): void;
}

export interface Rect {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

export interface Tile {
  x: number;
  y: number;
  size: number;
}
