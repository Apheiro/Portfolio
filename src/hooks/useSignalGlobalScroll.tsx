import { GlobalScrollContext } from '@/Providers/GlobalScrollProvider';
import { type Signal, useSignal } from '@preact/signals-react';
import { useCallback, useContext, useEffect } from 'react';
function useSignalGlobalScroll(): {
  x: Signal<number>;
  y: Signal<number>;
} {
  const globalScrollRef = useContext(GlobalScrollContext);
  const scrollPositionX = useSignal(0);
  const scrollPositionY = useSignal(0);
  // const [scrollValue, setScroll] = useState({ x: 0, y: 0 });
  // const scroll = useRef({ x: 0, y: 0 });
  const getScrollPosition = useCallback((e: Event) => {
    e.stopPropagation();
    const viewport = e.target as HTMLDivElement;
    scrollPositionX.value = viewport.scrollLeft;
    scrollPositionY.value = viewport.scrollTop;

    // setScroll({ x: viewport.scrollLeft, y: viewport.scrollTop });
  }, []);

  useEffect(() => {
    globalScrollRef?.current?.addEventListener(
      'scroll',
      getScrollPosition,
    );
    globalScrollRef?.current?.addEventListener(
      'resize',
      getScrollPosition,
    );

    return () => {
      globalScrollRef?.current?.removeEventListener(
        'scroll',
        getScrollPosition,
      );
      globalScrollRef?.current?.removeEventListener(
        'resize',
        getScrollPosition,
      );
    };
  }, []);

  return {
    x: scrollPositionX,
    y: scrollPositionY,
  };
}

export default useSignalGlobalScroll;
