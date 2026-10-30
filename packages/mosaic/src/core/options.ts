import type { MosaicElementOptions, MosaicOptions } from './types.js';

function number(
  value: number | undefined,
  fallback: number,
  name: string,
  positive = false,
): number {
  const result = value ?? fallback;
  if (
    !Number.isFinite(result) ||
    result < 0 ||
    (positive && result === 0)
  ) {
    throw new RangeError(
      `Mosaic ${name} must be ${positive ? 'greater than zero' : 'non-negative'} and finite.`,
    );
  }
  return result;
}

export function resolveOptions(options: MosaicOptions = {}) {
  return {
    size: number(options.size, 30, 'size', true),
    backgroundColor: options.backgroundColor ?? '#000000',
    borderColor: options.borderColor ?? '#1c1c1c',
    borderRadius: number(options.borderRadius, 0, 'borderRadius'),
    revealDuration: number(
      options.revealDuration,
      500,
      'revealDuration',
    ),
    pixelRatio:
      options.pixelRatio === undefined
        ? undefined
        : number(options.pixelRatio, 1, 'pixelRatio', true),
    respectReducedMotion: options.respectReducedMotion ?? true,
  };
}

export function resolveElementOptions(
  options: MosaicElementOptions = {},
) {
  const show = options.show ?? {};
  return {
    show: {
      initialState: show.initialState ?? false,
      range: number(show.range, 80, 'show.range'),
      minSize: number(show.minSize, 5, 'show.minSize'),
      duration: number(show.duration, 600, 'show.duration'),
      delay: number(show.delay, 0, 'show.delay'),
    },
    glow: options.glow
      ? {
          color: options.glow.color ?? '#a948ff',
          range: number(options.glow.range, 150, 'glow.range'),
          duration: number(
            options.glow.duration,
            1500,
            'glow.duration',
            true,
          ),
          loopDelay: number(
            options.glow.loopDelay,
            0,
            'glow.loopDelay',
          ),
          delay: number(options.glow.delay, 150, 'glow.delay'),
        }
      : undefined,
  };
}
