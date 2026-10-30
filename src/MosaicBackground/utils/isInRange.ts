function isInRange(
  target: SquaresObj,
  elementCords: ElementCords,
  aditionalRange?: number,
) {
  const { x: squareXc, y: squareYc }: { x: number; y: number } = {
    x: Math.abs(target.x + target.size / 2),
    y: Math.abs(target.y + target.size / 2),
  };
  return (
    squareXc >= elementCords.x.left - (aditionalRange ?? 0) &&
    squareXc <= elementCords.x.right + (aditionalRange ?? 0) &&
    squareYc >= elementCords.y.top - (aditionalRange ?? 0) &&
    squareYc <= elementCords.y.bottom + (aditionalRange ?? 0)
  );
}

export default isInRange;
