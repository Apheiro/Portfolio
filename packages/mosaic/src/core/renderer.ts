import { colord } from 'colord';
import type { Rect, Tile } from './types.js';
import type {
  resolveElementOptions,
  resolveOptions,
} from './options.js';
import { clamp, distanceToRect, sizeAtDistance } from './geometry.js';

type Color = ReturnType<ReturnType<typeof colord>['toRgb']>;

export interface RenderTarget {
  rect: Rect;
  progress: number;
  pulse: number;
  options: ReturnType<typeof resolveElementOptions>;
}

export function parseColor(color: string): Color {
  const parsed = colord(color);
  if (!parsed.isValid())
    throw new TypeError(
      `Unsupported mosaic color: ${color}. Use hex, RGB or HSL.`,
    );
  return parsed.toRgb();
}

function mix(from: Color, to: Color, amount: number): Color {
  const t = clamp(amount);
  return {
    r: from.r + (to.r - from.r) * t,
    g: from.g + (to.g - from.g) * t,
    b: from.b + (to.b - from.b) * t,
    a: from.a + (to.a - from.a) * t,
  };
}

function css(color: Color): string {
  return `rgba(${Math.round(color.r)},${Math.round(color.g)},${Math.round(color.b)},${color.a})`;
}

function applyTarget(
  tile: Tile,
  target: RenderTarget,
  baseColor: Color,
  glowColor: Color,
) {
  let color = baseColor;
  const cx = tile.x + tile.size / 2;
  const cy = tile.y + tile.size / 2;
  const distance = distanceToRect(cx, cy, target.rect);
  const { show, glow } = target.options;
  const local = clamp(
    target.progress * 1.5 -
      (show.range ? clamp(distance / show.range) : 0) * 0.5,
  );
  const progress = local * local * (3 - 2 * local);
  const endSize = sizeAtDistance(
    distance,
    tile.size,
    show.minSize,
    show.range,
  );
  const size = tile.size + (endSize - tile.size) * progress;
  if (glow && target.progress > 0 && distance <= glow.range) {
    const falloff = glow.range
      ? 1 - clamp(distance / glow.range)
      : Number(distance === 0);
    const phase = clamp(
      target.pulse * (1 + glow.delay / glow.duration) -
        ((1 - falloff) * glow.delay) / glow.duration,
    );
    const pulse = 1 - Math.abs(phase * 2 - 1);
    color = mix(color, glowColor, falloff * pulse * progress);
  }
  return { size, color };
}

export function drawGrid(
  context: CanvasRenderingContext2D,
  tiles: Tile[],
  width: number,
  height: number,
  options: ReturnType<typeof resolveOptions>,
  targets: RenderTarget[],
  reveal: number,
): void {
  context.clearRect(0, 0, width, height);
  const border = parseColor(options.borderColor);
  const background = parseColor(options.backgroundColor);
  const colors = targets.map((target) =>
    target.options.glow
      ? parseColor(target.options.glow.color)
      : border,
  );
  for (const tile of tiles) {
    const cx = tile.x + tile.size / 2;
    const cy = tile.y + tile.size / 2;
    let size = tile.size;
    // Reveal from the center, without modifying the original tile geometry.
    const revealRadius =
      Math.hypot(cx - width / 2, cy - height / 2) /
      (Math.hypot(width / 2, height / 2) || 1);
    let color = mix(
      background,
      border,
      clamp(reveal * 2 - revealRadius),
    );
    for (let i = 0; i < targets.length; i++) {
      const target = targets[i];
      if (!target) continue;
      const affected = applyTarget(
        tile,
        target,
        color,
        colors[i] ?? border,
      );
      size = Math.min(size, affected.size);
      color = affected.color;
    }
    if (size < 0.1) continue;
    const x = tile.x + (tile.size - size) / 2;
    const y = tile.y + (tile.size - size) / 2;
    const radius = Math.min(options.borderRadius, size / 2);
    context.fillStyle = options.backgroundColor;
    context.strokeStyle = css(color);
    context.lineWidth = 1;
    if (radius > 0) {
      context.beginPath();
      context.moveTo(x + radius, y);
      context.arcTo(x + size, y, x + size, y + size, radius);
      context.arcTo(x + size, y + size, x, y + size, radius);
      context.arcTo(x, y + size, x, y, radius);
      context.arcTo(x, y, x + size, y, radius);
      context.closePath();
      context.fill();
      context.stroke();
    } else {
      context.fillRect(x, y, size, size);
      context.strokeRect(
        x + 0.5,
        y + 0.5,
        Math.max(0, size - 1),
        Math.max(0, size - 1),
      );
    }
  }
}
