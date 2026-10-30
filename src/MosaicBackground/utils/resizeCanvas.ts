function resizeCanvas(canvas: HTMLCanvasElement, squareSize: number) {
  const parent = canvas?.parentElement;
  canvas.width = parent.clientWidth;
  canvas.height = parent.clientHeight;
  const rows = Math.ceil(canvas.height / squareSize);
  const cols = Math.ceil(canvas.width / squareSize);
  return { rows, cols };
}

export default resizeCanvas;
