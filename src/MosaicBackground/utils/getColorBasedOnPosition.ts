import { colord, extend } from 'colord';
import mixPlugin from 'colord/plugins/mix';
import getDistanceFromElement from './getDistanceFromElement';
extend([mixPlugin]);

function calculateColor({
  distanceFromElement,
  startColor,
  aditionalRange,
  endColor,
}: {
  distanceFromElement: number;
  aditionalRange?: number;
  startColor: string;
  endColor: string;
}) {
  const diference = distanceFromElement / (aditionalRange ?? 100);
  let calcPercentage = 0 + (1 - 0) * diference;
  if (calcPercentage > 1) calcPercentage = 1;
  const color = colord(endColor).mix(
    colord(startColor),
    calcPercentage,
  );
  return color.toHex();
}

function getColorBasedOnPosition(
  target: SquaresObj,
  elementCords: ElementCords,
  startColor: string,
  endColor: string,
  aditionalRange?: number,
) {
  const distanceFromElement = getDistanceFromElement({
    elCoords: elementCords,
    sqCoords: {
      x: target.x + target.size / 2,
      y: target.y + target.size / 2,
    },
  });
  if (distanceFromElement === 0) return startColor;
  const color = calculateColor({
    distanceFromElement,
    startColor,
    aditionalRange,
    endColor,
  });
  return color;
}

export default getColorBasedOnPosition;
