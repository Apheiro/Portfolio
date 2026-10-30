import { MosaicBackgroundContextRef } from '@/MosaicBackground/providers/MosaicBackgroundProvider';
import useDebouncedMoment from '@/hooks/useDebouncedMoment';
import useDidResize from '@/hooks/useDidResize';
import { useDisclosure } from '@mantine/hooks';
import { useSignalEffect } from '@preact/signals-react';
import {
  type MutableRefObject,
  useContext,
  useEffect,
  useRef,
} from 'react';

interface HookOptions {
  show?: {
    initialState?: boolean;
    delay?: number;
    range?: number;
    minSize?: number;
  };
  glow?: {
    color?: string;
    duration?: number;
    range?: number;
    loopDelay?: number;
    delay?: number;
  };
}

type HookReturn<RefElement> = [
  MutableRefObject<RefElement>,
  {
    show: boolean;
    open: () => void;
    close: () => void;
    toggle: () => void;
  },
];

function useAnimateElement<RefElement extends HTMLElement>(
  { show, glow }: HookOptions = {
    show: {
      initialState: false,
      range: 0,
      minSize: 0,
    },
  },
): HookReturn<RefElement> {
  const { initialState, range, delay, minSize } = show;
  const refElement = useRef<RefElement>(null);
  const { animationScope, gridCreated } = useContext(
    MosaicBackgroundContextRef,
  );
  const [isOpen, { open, close, toggle }] =
    useDisclosure(initialState);
  let canceledGlow = false;

  const [isResizing, setResizing] = useDebouncedMoment(false, 2000);
  const uniqueId = useRef(Math.random());

  useDidResize(() => {
    setResizing();
  });

  // re-calculate and get the squares over the element and set updating to true when canvas values changes
  useSignalEffect(() => {
    console.log('1?');
    animationScope.current.methods.addElement({
      element: refElement,
      range,
      minSize,
      glow,
      id: uniqueId.current,
    });
  });

  useEffect(() => {
    canceledGlow = false;

    if (delay) {
      setTimeout(() => {
        animations();
      }, delay);
    } else {
      animations();
    }

    return () => {
      canceledGlow = true;
    };
  }, [isOpen, isResizing, gridCreated]);

  const animations = () => {
    if (isOpen && !isResizing && gridCreated) {
      const { resolve, promise: openPromise } =
        Promise.withResolvers();

      animationScope.current.methods.openGridSection({
        id: uniqueId.current,
        resolve,
      });

      openPromise.then(() => {
        if (!canceledGlow) {
          animationScope.current.methods.glowElementSection({
            id: uniqueId.current,
          });
        }
      });
    } else {
      canceledGlow = true;
      animationScope.current.methods.pauseGlowElementSection({
        id: uniqueId.current,
        isOpen,
      });
      animationScope.current.methods.closeGridSection({
        id: uniqueId.current,
      });
    }
  };

  return [refElement, { show: isOpen, open, close, toggle }];
}

export default useAnimateElement;
