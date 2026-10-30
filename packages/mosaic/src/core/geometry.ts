import type { Rect, Tile } from './types.js';

export function clamp(value: number, min = 0, max = 1): number {
  return Math.max(min, Math.min(max, value));
}

export function distanceToRect(
  x: number,
  y: number,
  rect: Rect,
): number {
  const dx = Math.max(rect.left - x, 0, x - rect.right);
  const dy = Math.max(rect.top - y, 0, y - rect.bottom);
  return Math.hypot(dx, dy);
}

/** Convert viewport coordinates into canvas-local CSS pixels, including CSS scaling. */
export function relativeRect(
  element: Rect,
  canvas: Rect,
  width: number,
  height: number,
): Rect {
  const scaleX = width / (canvas.right - canvas.left || width || 1);
  const scaleY = height / (canvas.bottom - canvas.top || height || 1);
  return {
    left: (element.left - canvas.left) * scaleX,
    right: (element.right - canvas.left) * scaleX,
    top: (element.top - canvas.top) * scaleY,
    bottom: (element.bottom - canvas.top) * scaleY,
  };
}

export function createTiles(
  width: number,
  height: number,
  size: number,
): Tile[] {
  if (!Number.isFinite(size) || size <= 0)
    throw new RangeError('Mosaic size must be greater than zero.');
  const tiles: Tile[] = [];
  for (let row = 0; row < Math.ceil(height / size); row++) {
    for (let col = 0; col < Math.ceil(width / size); col++) {
      tiles.push({ x: col * size, y: row * size, size });
    }
  }
  return tiles;
}

export function sizeAtDistance(
  distance: number,
  tileSize: number,
  minSize: number,
  range: number,
): number {
  if (distance === 0) return 0;
  if (range <= 0 || distance >= range) return tileSize;
  return (
    clamp(minSize, 0, tileSize) +
    ((tileSize - clamp(minSize, 0, tileSize)) * distance) / range
  );
}
