function generateSquares({
  rows,
  cols,
  size,
  borderColor,
  backgroundColor,
  borderRadius,
}: {
  rows: number;
  cols: number;
  size: number;
  borderColor: string;
  backgroundColor: string;
  borderRadius: number;
}) {
  const squares: SquaresObj[] = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = col * size;
      const y = row * size;
      squares.push({
        id: `square-${row}-${col}`,
        x,
        y,
        size,
        borderColor,
        backgroundColor,
        borderRadius,
      });
    }
  }
  return squares;
}

export default generateSquares;
