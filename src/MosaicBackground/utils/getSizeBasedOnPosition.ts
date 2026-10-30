import getDistanceFromElement from './getDistanceFromElement';

function calculateSize({
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

function getSizeBasedOnPosition(
  target: SquaresObj,
  minSize: number,
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

  const size = calculateSize({
    distanceToElement: distanceFromElement,
    options: {
      minScale: minSize,
      maxScale: target.size,
      range: aditionalRange,
    },
  });
  return size;
}

export default getSizeBasedOnPosition;
