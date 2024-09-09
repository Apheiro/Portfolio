import { MosaicBackgroundContextRef } from '@/Providers/MosaicBackgroundProvider';
import { useDidUpdate, useDisclosure } from '@mantine/hooks';
import anime from 'animejs';
import { type RefObject, useContext, useRef, useState } from 'react';

type UseMosaicReturn<RefElement> = {
  ref: RefObject<RefElement>;
  show: boolean;
  showFns: {
    open: () => void;
    close: () => void;
    toggle: () => void;
  };
  isVisible: boolean;
};

function isInViewport({
  x,
  y,
  width,
  height,
}: { x: number; y: number; width: number; height: number }) {
  if (!window) return false;
  return (
    (y <= window.innerHeight &&
      x <= window.innerWidth &&
      y > 0 &&
      x > 0) ||
    (y + height <= window.innerHeight &&
      x + width <= window.innerWidth &&
      y + height > 0 &&
      x + width > 0)
  );
}

function calculateDistanceFromElement({
  eCoords,
  point,
}: {
  eCoords: {
    top: number;
    left: number;
    bottom: number;
    right: number;
  };
  point: { x: number; y: number };
}) {
  let horizontalDistance = 0;
  if (point.x <= eCoords.left) {
    horizontalDistance = eCoords.left - point.x;
  } else if (point.x >= eCoords.right) {
    horizontalDistance = point.x - eCoords.right;
  }

  let verticalDistance = 0;
  if (point.y <= eCoords.top) {
    verticalDistance = eCoords.top - point.y;
  } else if (point.y >= eCoords.bottom) {
    verticalDistance = point.y - eCoords.bottom;
  }

  return Math.sqrt(horizontalDistance ** 2 + verticalDistance ** 2);
}

function calculateScale({
  distanceToElement,
  options,
}: {
  distanceToElement: number;
  options?: { minScale?: number; maxScale?: number; range?: number };
}) {
  const minScale = options?.minScale ?? 0;
  const maxScale = options?.maxScale ?? 1;
  let calcScale = distanceToElement / (options?.range ?? 100);
  calcScale = minScale + (maxScale - minScale) * calcScale;
  return calcScale;
}

function openMosaic<RefElement extends HTMLElement>({
  element,
  mosaicsContainer,
  options,
}: {
  element: RefElement;
  mosaicsContainer: HTMLDivElement;
  options?: {
    range?: number;
    maxScale?: number;
    minScale?: number;
    glow?: boolean;
  };
}) {
  const eBasicCoords = element.getBoundingClientRect();
  const eCoords = {
    top: eBasicCoords.y,
    left: eBasicCoords.x,
    bottom: eBasicCoords.y + eBasicCoords.height,
    right: eBasicCoords.x + eBasicCoords.width,
  };
  const openAnimation = anime.timeline({
    autoplay: false,
  });
  const glowAnimation = anime.timeline({
    autoplay: false,
    loop: true,
  });

  const refillBorderColor = anime.timeline({
    autoplay: false,
  });

  let indexLoop = 0;
  for (const child of mosaicsContainer.childNodes || []) {
    const mosaic = child as HTMLDivElement;
    const mCoords = mosaic.getBoundingClientRect();

    const currentScale: number = anime.get(mosaic, 'scale') as number;
    const { mxC, myC } = {
      mxC: mCoords.x + mCoords.width / 2,
      myC: mCoords.y + mCoords.height / 2,
    };
    const distanceToElement = calculateDistanceFromElement({
      eCoords,
      point: { x: mxC, y: myC },
    });
    if (
      distanceToElement > (options?.range ?? 100) &&
      !isInViewport(mCoords)
    ) {
      indexLoop++;
      continue;
    }
    if (distanceToElement < (options?.range ?? 100)) {
      const newScale = calculateScale({
        distanceToElement,
        options,
      });
      const isInsideTheElement =
        mxC >= eCoords.left &&
        mxC <= eCoords.right &&
        myC >= eCoords.top &&
        myC <= eCoords.bottom;
      if (currentScale <= newScale) {
        indexLoop++;
        continue;
      }
      openAnimation.add(
        {
          targets: mosaic,
          scale: isInsideTheElement ? 0 : newScale,
          delay: newScale * 500,
        },
        0,
      );
      glowAnimation.add(
        {
          targets: mosaic,
          borderColor: [
            { value: '#111111', duration: 0 },
            { value: '#a560c5', duration: 500 },
            { value: '#111111', duration: 500 },
          ],
          easing: 'linear',
        },
        newScale * 2000,
      );
      refillBorderColor.add(
        {
          targets: mosaic,
          borderColor: [{ value: '#111111', duration: 1000 }],
        },
        newScale * 2000,
      );
    }
    indexLoop++;
  }
  console.log('ends ?');
  return { openAnimation, glowAnimation, refillBorderColor };
}

function useOpenBackground<RefElement extends HTMLElement>(
  initialState?: boolean,
  options?: {
    minScale?: number;
    maxScale?: number;
    range?: number;
    glow?: boolean;
  },
): UseMosaicReturn<RefElement> {
  const elementRef = useRef<RefElement>(null);
  const [showElement, showElementFns] = useDisclosure(initialState);
  const [isVisible, isVisibleFns] = useDisclosure(false);
  const { parentRef, isResizing, isLoading } = useContext(
    MosaicBackgroundContextRef,
  );
  const [animationRef, setAnimationRef] =
    useState<anime.AnimeTimelineInstance | null>(null);
  const [glowAnimationRef, setGlowAnimationRef] =
    useState<anime.AnimeTimelineInstance | null>(null);
  const [
    refillBorderColorAnimationRef,
    setRefillBorderColorAnimationRef,
  ] = useState<anime.AnimeTimelineInstance | null>(null);

  useDidUpdate(() => {
    if (isLoading || !elementRef?.current || !parentRef?.current)
      return;
    const animations = openMosaic({
      mosaicsContainer: parentRef?.current,
      element: elementRef.current,
      options,
    });
    setAnimationRef(animations.openAnimation);
    setRefillBorderColorAnimationRef(animations.refillBorderColor);
    setGlowAnimationRef(animations.glowAnimation);
  }, [isLoading]);

  useDidUpdate(() => {
    if (isResizing && elementRef?.current) {
      isVisibleFns.close();
      setAnimationRef(null);
      setGlowAnimationRef(null);
    }
  }, [isResizing]);

  useDidUpdate(() => {
    if (
      animationRef &&
      glowAnimationRef &&
      refillBorderColorAnimationRef
    ) {
      setTimeout(() => {
        if (showElement) {
          animationRef.direction !== 'normal' &&
            animationRef.reverse();
          animationRef?.play();
          animationRef?.finished.then(() => {
            isVisibleFns.open();
            if (options?.glow) glowAnimationRef?.play();
          });
        } else {
          animationRef.direction !== 'reverse' &&
            animationRef.reverse();
          animationRef?.play();
          animationRef?.finished.then(() => {
            isVisibleFns.close();
            refillBorderColorAnimationRef?.play();
            if (options?.glow) {
              glowAnimationRef?.pause();
              glowAnimationRef?.seek(0);
            }
          });
        }
      }, 100);
    }
  }, [
    animationRef,
    glowAnimationRef,
    refillBorderColorAnimationRef,
    showElement,
  ]);

  return {
    ref: elementRef,
    show: showElement,
    showFns: showElementFns,
    isVisible,
  };
}

export default useOpenBackground;
