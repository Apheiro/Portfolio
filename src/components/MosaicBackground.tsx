'use client';

import { MosaicBackgroundContextRef } from '@/Providers/MosaicBackgroundProvider';
import {
  useDebouncedCallback,
  useDidUpdate,
  useDisclosure,
  useViewportSize,
} from '@mantine/hooks';
import anime from 'animejs';
import {
  type Dispatch,
  type HTMLAttributes,
  type SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

function squaresCalculator(
  setQuantity: Dispatch<SetStateAction<number>>,
  parent: HTMLDivElement,
  sizeOfSquares: number,
) {
  console.log('square calculated');
  const { height, width } = parent.getBoundingClientRect();
  const quantity = (width * height) / sizeOfSquares ** 2;
  setQuantity(Math.floor(quantity));
}

function Square({
  idNumber,
  sizeOfMesh,
  stopLoading,
  ...props
}: HTMLAttributes<HTMLDivElement> & {
  idNumber: number;
  sizeOfMesh: number;
  stopLoading: () => void;
}) {
  useEffect(() => {
    if (sizeOfMesh === idNumber + 1) {
      stopLoading();
    }
  }, []);

  return <div {...props} />;
}

function MosaicBackground({
  sizeOfSquares = 50,
}: { sizeOfSquares?: number }) {
  const {
    parentRef,
    quantity,
    setQuantity,
    isResizing,
    resizing,
    stopResizing,
    // isLoading,
    loading,
    stopLoading,
  } = useContext(MosaicBackgroundContextRef);
  const { width, height } = useViewportSize();
  const [
    squareAreLoading,
    { open: squareLoading, close: stopSquareLoading },
  ] = useDisclosure(true);
  const [ommitFirstUpdate, setOmmitFirstUpdate] = useState(true);
  const calculateSquares = useDebouncedCallback(
    squaresCalculator,
    500,
  );
  const mosaicElements = useMemo(
    () => Array.from({ length: quantity }, (_, idx) => idx),
    [quantity],
  );

  useDidUpdate(() => {
    if (!squareAreLoading) {
      if (parentRef?.current && window) {
        const computedStyle = window.getComputedStyle(
          parentRef?.current,
        );
        const gridCols =
          computedStyle.gridTemplateColumns.split(' ').length;
        const gridRows =
          computedStyle.gridTemplateRows.split(' ').length;
        anime({
          targets: '.square',
          borderColor: ['black', '#111111'],
          duration: 500,
          delay: anime.stagger(25, {
            grid: [gridCols, gridRows],
            from: 'center',
          }),
        }).finished.then(() => {
          setTimeout(() => {
            stopLoading();
          }, 1000);
        });
      }
    } else {
      loading();
    }
  }, [squareAreLoading]);

  useEffect(() => {
    if (!parentRef?.current) return;
    squaresCalculator(setQuantity, parentRef.current, sizeOfSquares);
  }, []);

  useDidUpdate(() => {
    if (quantity === 0) squareLoading();
  }, [quantity]);

  useDidUpdate(() => {
    setOmmitFirstUpdate(false);
    if (!parentRef?.current || !width || !height || ommitFirstUpdate)
      return;
    setQuantity(0);
    stopResizing();
    if (!isResizing) resizing();
    calculateSquares(setQuantity, parentRef.current, sizeOfSquares);
  }, [width, height]);

  return (
    <div
      ref={parentRef}
      style={{
        gridTemplateColumns: ` repeat(auto-fit,minmax(${sizeOfSquares}px,1fr))`,
      }}
      className='grid absolute right-0 top-0 left-0 bottom-0 pointer-events-none z-[2]'
    >
      {quantity === 0 ? (
        <div className='absolute right-0 top-0 left-0 bottom-0 bg-black z-[1]' />
      ) : (
        mosaicElements.map((elementNumber) => (
          <Square
            key={elementNumber}
            idNumber={elementNumber}
            sizeOfMesh={mosaicElements.length}
            stopLoading={stopSquareLoading}
            className='square w-full h-full bg-black border-[1px] '
            style={{ transform: 'scale(1)', borderColor: 'black' }}
          />
        ))
      )}
    </div>
  );
}

export default MosaicBackground;
