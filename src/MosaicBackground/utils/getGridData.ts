import getMiddle from './getMiddle';

function getGridData(squareArray: SquaresObj[]): {
  centerId: string;
  grid: [number, number];
} {
  if (squareArray.length === 0) return { centerId: '', grid: [0, 0] };
  const [_s, firstRow, firstCol] = squareArray[0].id.split('-');
  const [_q, lastRow, lastCol] =
    squareArray[squareArray.length - 1].id.split('-');
  const centerId = `square-${getMiddle(firstRow, lastRow)}-${getMiddle(firstCol, lastCol)}`;
  return {
    centerId,
    grid: [
      Number(lastCol) - Number(firstCol) + 1,
      Number(lastRow) - Number(firstRow) + 1,
    ],
  };
}

export default getGridData;
