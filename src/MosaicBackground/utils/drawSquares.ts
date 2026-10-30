const animationStatus = { name: 'animation', value: false };

function drawSquares(
  canvas: HTMLCanvasElement,
  squares: SquaresObj[],
) {
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (const square of squares) {
    ctx.strokeStyle = square.borderColor;
    // ctx.strokeStyle = `rgba(255, 255, 255, ${square.opacity ?? 1})`;
    ctx.strokeRect(square.x, square.y, square.size, square.size);
    ctx.fillStyle = square.backgroundColor;
    ctx.fillRect(square.x, square.y, square.size, square.size);
  }
}

function animeHandler(
  canvas: HTMLCanvasElement,
  squares: SquaresObj[],
  animationId: string,
) {
  return {
    onRender: () => {
      if (!animationStatus.value) {
        animationStatus.name = animationId;
        animationStatus.value = true;
      }
      if (animationStatus.name === animationId) {
        drawSquares(canvas, squares);
      }
      // console.log(animationStatus.name);
    },
    onComplete: () => {
      if (animationStatus.name === animationId) {
        animationStatus.name = 'animation';
        animationStatus.value = false;
      }
    },
  };
}

export default drawSquares;
export { animationStatus, animeHandler };
