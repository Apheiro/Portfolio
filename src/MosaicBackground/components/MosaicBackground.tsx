'use client';
import { MosaicBackgroundContextRef } from '@/MosaicBackground/providers/MosaicBackgroundProvider';
import useDebouncedMoment from '@/hooks/useDebouncedMoment';
import useDidResize from '@/hooks/useDidResize';
import { useDidUpdate, useDisclosure } from '@mantine/hooks';
import { useSignalEffect } from '@preact/signals-react';
import { useContext, useEffect, useRef } from 'react';

interface Props {
  size?: number;
  backgroundColor?: string;
  borderColor?: string;
  borderRadius?: number;
}

function MosaicBackground({
  size = 30,
  backgroundColor = '#000000',
  borderColor = '#1c1c1c',
  borderRadius = 0,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isBgEnabled, enableBg] = useDebouncedMoment(false, 2000);
  const [firstLoadBg, { close }] = useDisclosure(true);
  const { canvasRef, isResizing, startResize, animationScope } =
    useContext(MosaicBackgroundContextRef);

  // 1. Generating new squares bg for first time and Changin canvas props and remove the full color bg.
  useEffect(() => {
    console.log('create canvas data');
    animationScope.current.methods.updateCanvasData({
      size,
      backgroundColor,
      borderColor,
      borderRadius,
    });
    close();
  }, []);

  // 2. Draw squares on canvas when the canvas and squares are updated.
  useSignalEffect(() => {
    animationScope.current.methods.createGrid();
  });

  // 3. If the canvas container is resizing set resizing status on and enables a full color background
  useDidResize(() => {
    enableBg();
    startResize();
  }, containerRef);

  // 3.1 Animate squares out on resize
  useDidUpdate(() => {
    const { resolve, promise } = Promise.withResolvers();
    if (isResizing) {
      animationScope.current.methods.removeGrid({ resolve });
      promise.then(() => {
        animationScope.current.refresh();
      });
    }
    // 3.2 recalculating the new squares and canvas props on resize stops
    else {
      animationScope.current.methods.updateCanvasData({
        size,
        backgroundColor,
        borderColor,
        borderRadius,
      });
    }
  }, [isResizing]);

  return (
    <div
      ref={containerRef}
      className='w-full h-full absolute inset-0 z-2'
    >
      <canvas ref={canvasRef} className='absolute inset-0 z-1' />
      {(isBgEnabled || firstLoadBg) && (
        <div className='absolute right-0 top-0 left-0 bottom-0 bg-black z-0' />
      )}
    </div>
  );
}

export default MosaicBackground;
