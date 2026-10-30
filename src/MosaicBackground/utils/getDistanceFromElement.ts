function getDistanceFromElement({
  elCoords,
  sqCoords,
}: {
  elCoords: ElementCords;
  sqCoords: { x: number; y: number };
}) {
  let horizontalDistance = 0;
  if (sqCoords.x <= elCoords.x.left) {
    horizontalDistance = elCoords.x.left - sqCoords.x;
  } else if (sqCoords.x >= elCoords.x.right) {
    horizontalDistance = sqCoords.x - elCoords.x.right;
  }
  let verticalDistance = 0;
  if (sqCoords.y <= elCoords.y.top) {
    verticalDistance = elCoords.y.top - sqCoords.y;
  } else if (sqCoords.y >= elCoords.y.bottom) {
    verticalDistance = sqCoords.y - elCoords.y.bottom;
  }
  return Math.sqrt(horizontalDistance ** 2 + verticalDistance ** 2);
}

export default getDistanceFromElement;
