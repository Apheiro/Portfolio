function getMiddle(point1: number | string, point2: number | string) {
  const { point1Value, point2Value } = {
    point1Value: typeof point1 === 'string' ? Number(point1) : point1,
    point2Value: typeof point2 === 'string' ? Number(point2) : point2,
  };
  return Math.floor(point1Value + (point2Value - point1Value) / 2);
}

export default getMiddle;
