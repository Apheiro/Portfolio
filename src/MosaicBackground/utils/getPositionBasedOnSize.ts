import type getSizeBasedOnPosition from './getSizeBasedOnPosition';

function getPositionBasedOnSize(
  target: SquaresObj,
  axis: 'x' | 'y',
  newSize: number,
  elementCords: ElementCords,
  getSize: typeof getSizeBasedOnPosition,
  aditionalRange?: number,
) {
  if (target.size > newSize)
    return (
      target[axis] +
      (target.size -
        getSize(target, newSize, elementCords, aditionalRange)) /
        2
    );
  return (
    target[axis] -
    (target.size -
      getSize(target, newSize, elementCords, aditionalRange)) /
      2
  );
}

export default getPositionBasedOnSize;
