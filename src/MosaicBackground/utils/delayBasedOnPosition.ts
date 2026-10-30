import getDistanceFromElement from './getDistanceFromElement';

function calculateDelay({
  distanceToElement,
  options,
}: {
  distanceToElement: number;
  options?: { minScale?: number; maxScale?: number; range?: number };
}) {
  const minScale = options?.minScale ?? 0;
  const maxScale = options?.maxScale ?? 25;
  const diference = distanceToElement / (options?.range ?? 100);
  const calcScale = minScale + (maxScale - minScale) * diference;
  if (calcScale > maxScale) return maxScale;
  return calcScale;
}
export default function delayBasedOnPosition(
  target: SquaresObj,
  minDelay: number,
  elementCords: ElementCords,
  aditionalRange?: number,
) {
  const distanceFromElement = getDistanceFromElement({
    elCoords: elementCords,
    sqCoords: {
      x: target.x + target.size / 2,
      y: target.y + target.size / 2,
    },
  });
  if (distanceFromElement === 0) return 0;
  const size = calculateDelay({
    distanceToElement: distanceFromElement,
    options: {
      minScale: minDelay,
      maxScale: minDelay * 10,
      range: aditionalRange,
    },
  });
  return size;
}
