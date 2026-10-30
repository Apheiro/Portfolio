'use client';
import useDebouncedMoment from '@/hooks/useDebouncedMoment';
import { useDisclosure } from '@mantine/hooks';
import { Signal, useSignal } from '@preact/signals-react';
import {
  type JSAnimation,
  type Scope,
  animate,
  createScope,
  stagger,
} from 'animejs';
import {
  type MutableRefObject,
  type RefObject,
  createContext,
  useRef,
} from 'react';
import getD from '../utils/delayBasedOnPosition';
import generateSquares from '../utils/generateSquare';
import getColorBasedOnPosition from '../utils/getColorBasedOnPosition';
import getElementCords from '../utils/getElementCords';
import getGridData from '../utils/getGridData';
import getPositionBasedOnSize from '../utils/getPositionBasedOnSize';
import getSizeBasedOnPosition from '../utils/getSizeBasedOnPosition';
import isInRange from '../utils/isInRange';
import resizeCanvas from '../utils/resizeCanvas';

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

const MosaicBackgroundContextRef = createContext<{
  canvasRef?: RefObject<HTMLCanvasElement> | undefined;
  animationScope?: MutableRefObject<Scope> | null;
  isResizing: boolean;
  startResize: () => void;
  gridCreated: boolean;
  canvas: Signal<{
    data: CanvasProps;
    squares: SquaresObj[];
  }>;
}>({
  canvasRef: undefined,
  animationScope: null,
  isResizing: false,
  startResize: () => {},
  gridCreated: false,
  canvas: new Signal<{
    data: CanvasProps;
    squares: SquaresObj[];
  }>(),
});

function MosaicBackgroundProvider({
  children,
}: { children: React.ReactNode }) {
  const canvas = useSignal<{
    data: CanvasProps;
    squares: SquaresObj[];
  }>({
    data: {
      rows: 0,
      cols: 0,
      squareStyle: {
        size: 0,
        borderColor: '#1c1c1c',
        backgroundColor: '#000000',
        borderRadius: 0,
      },
    },
    squares: [],
  });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isResizing, startResize] = useDebouncedMoment(false, 1000);
  const [
    gridCreated,
    { open: gridCreatedOpen, close: gridCreatedClose },
  ] = useDisclosure(false);
  const scope = useRef<Scope>(
    createScope({
      defaults: {
        frameRate: 60,
        onUpdate: () => {
          console.log('?');
          drawSquares(canvasRef.current, canvas.value.squares);
        },
      },
    }).add((self) => {
      const animationsIds: string[] = [];
      const loopAnimations: {
        id: string;
        animationRef: JSAnimation;
      }[] = [];
      const controlAnimations: {
        id: string;
        animationRef: JSAnimation;
      }[] = [];

      self.add(
        'updateCanvasData',
        (props: {
          size: number;
          backgroundColor: string;
          borderColor: string;
          borderRadius: number;
        }) => {
          const { size, backgroundColor, borderColor, borderRadius } =
            props;
          const gridSize = resizeCanvas(canvasRef.current, size);
          const newCanvasProps = {
            rows: gridSize.rows,
            cols: gridSize.cols,
            squareStyle: {
              size,
              borderColor,
              backgroundColor,
              borderRadius,
            },
          };
          const newSquares = generateSquares({
            rows: gridSize.rows,
            cols: gridSize.cols,
            size,
            backgroundColor,
            borderColor,
            borderRadius,
          });

          canvas.value = {
            data: newCanvasProps,
            squares: newSquares,
          };
        },
      );

      self.add('createGrid', (params?: { resolve?: () => void }) => {
        const {
          data: { rows, cols },
          squares,
        } = canvas.value;
        const { resolve } = params || {};
        animate(squares, {
          duration: 250,
          borderColor: (target: SquaresObj) => [
            target.backgroundColor,
            target.borderColor,
          ],
          delay: stagger(10, {
            grid: [cols, rows],
            from: 'center',
          }),
        }).then(() => {
          gridCreatedOpen();
          resolve?.();
        });
      });

      self.add(
        'removeGrid',
        ({ resolve }: { resolve?: () => void }) => {
          const {
            data: { rows, cols },
            squares,
          } = canvas.value;
          animate(squares, {
            duration: 350,
            borderColor: (target: SquaresObj) => [
              target.borderColor,
              target.backgroundColor,
            ],
            delay: stagger(10, {
              grid: [cols, rows],
              from: 'center',
            }),
          }).then(() => {
            gridCreatedClose();
            resolve?.();
          });
        },
      );

      self.add(
        'addElement',
        ({
          element,
          range,
          minSize,
          glow,
          id,
        }: {
          element: MutableRefObject<HTMLElement | null>;
          range: number;
          minSize: number;
          glow?: {
            color?: string;
            duration?: number;
            range?: number;
            loopDelay?: number;
            delay?: number;
          };
          id: string;
        }) => {
          if (!element.current || animationsIds.includes(id)) {
            return null;
          }
          const { squares } = canvas.value;
          const cords = getElementCords(element);
          const baseSquares = squares.filter((s) =>
            isInRange(s, cords),
          );
          const { centerId } = getGridData(baseSquares);
          const elSquaresWithRange = squares.filter((s) =>
            isInRange(s, cords, range),
          );
          const { grid } = getGridData(elSquaresWithRange);
          const centerGrid = elSquaresWithRange.findIndex(
            (square) => square.id === centerId,
          );

          animationsIds.push(id);

          const openGridSectionAnimation = animate(
            elSquaresWithRange,
            {
              autoplay: false,
              size: (target: SquaresObj) =>
                getSizeBasedOnPosition(target, minSize, cords, range),
              y: (target: SquaresObj) =>
                getPositionBasedOnSize(
                  target,
                  'y',
                  minSize,
                  cords,
                  getSizeBasedOnPosition,
                  range,
                ),
              x: (target: SquaresObj) =>
                getPositionBasedOnSize(
                  target,
                  'x',
                  minSize,
                  cords,
                  getSizeBasedOnPosition,
                  range,
                ),
              delay: stagger(100, {
                grid: grid,
                from: centerGrid,
              }),
            },
          );

          controlAnimations.push({
            id: `openGridSection-${id}`,
            animationRef: openGridSectionAnimation,
          });

          if (!glow) {
            return;
          }

          const {
            range: rangeG,
            color,
            duration,
            delay,
            loopDelay,
          } = glow;
          const elSquaresWithRangeGlow = squares.filter((s) =>
            isInRange(s, cords, rangeG),
          );

          const {
            squareStyle: { borderColor },
          } = canvas.value.data;

          loopAnimations.push({
            id: `glowElementSection-${id}`,
            animationRef: animate(elSquaresWithRangeGlow, {
              autoplay: false,
              keyframes: {
                '0%': { borderColor: borderColor },
                '50%': {
                  borderColor: (target: SquaresObj) =>
                    getColorBasedOnPosition(
                      target,
                      cords,
                      borderColor,
                      color,
                      rangeG,
                    ),
                },
                '100%': { borderColor: borderColor },
              },
              delay: (target: SquaresObj) =>
                getD(target, delay, cords, rangeG),
              loopDelay: loopDelay,
              loop: true,
              duration: duration,
            }),
          });
          for (const target of elSquaresWithRangeGlow) {
            target.borderColor = 'transparent';
          }
        },
      );

      self.add(
        'openGridSection',
        ({ id, resolve }: { id: string; resolve?: () => void }) => {
          for (const animation of controlAnimations) {
            if (animation.id !== `openGridSection-${id}`) continue;
            animation.animationRef.play();
            animation.animationRef.then(() => {
              resolve?.();
            });
          }
        },
      );

      self.add('closeGridSection', ({ id }: { id: string }) => {
        for (const animation of controlAnimations) {
          if (animation.id !== `openGridSection-${id}`) continue;
          animation.animationRef.speed = 3;
          animation.animationRef.reverse();
        }
      });

      self.add('glowElementSection', ({ id }: { id: string }) => {
        for (const animationLoop of loopAnimations) {
          if (animationLoop.id !== `glowElementSection-${id}`)
            continue;
          animationLoop.animationRef.onLoop = () => null;
          animationLoop.animationRef.play();
        }
      });

      self.add(
        'pauseGlowElementSection',
        ({ id, isOpen }: { id: string; isOpen?: boolean }) => {
          for (const animationLoop of loopAnimations) {
            if (animationLoop.id !== `glowElementSection-${id}`)
              continue;
            if (!isOpen) {
              animationLoop.animationRef.onLoop = () => {
                animationLoop.animationRef.pause();
              };
              continue;
            }
            animationLoop.animationRef.pause();
          }
        },
      );
    }),
  );

  return (
    <MosaicBackgroundContextRef.Provider
      value={{
        canvasRef,
        animationScope: scope,
        isResizing,
        startResize,
        canvas,
        gridCreated,
      }}
    >
      {children}
    </MosaicBackgroundContextRef.Provider>
  );
}

export { MosaicBackgroundProvider, MosaicBackgroundContextRef };
