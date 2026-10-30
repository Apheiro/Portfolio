interface SquareStyle {
  size: number;
  borderColor: string;
  backgroundColor: string;
  borderRadius: number;
}

interface SquaresObj extends SquareStyle {
  id: string;
  x: number;
  y: number;
}

interface CanvasProps {
  rows: number;
  cols: number;
  squareStyle: SquareStyle;
}
