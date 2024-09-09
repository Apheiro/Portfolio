import { GlobalScrollContext } from '@/Providers/GlobalScrollProvider';
import { useScrollIntoView as useScrollIntoViewOriginal } from '@mantine/hooks';
import { useCallback, useContext, useEffect } from 'react';

interface ScrollIntoViewParams {
  onScrollFinish?: () => void;
  duration?: number;
  axis?: 'x' | 'y';
  easing?: (t: number) => number;
  offset?: number;
  cancelable?: boolean;
  isList?: boolean;
}

interface ScrollIntoViewAnimation {
  alignment?: 'start' | 'end' | 'center';
}

interface ScrollIntoViewReturnType<
  Target extends HTMLElement,
  Parent extends HTMLElement | null = null,
> {
  scrollableRef: React.MutableRefObject<Parent>;
  targetRef: React.MutableRefObject<Target>;
  scrollIntoView: (params?: ScrollIntoViewAnimation) => void;
  cancel: () => void;
}

function useGlobalScrollIntoView<Target extends HTMLElement>(
  params?: ScrollIntoViewParams,
): Omit<
  ScrollIntoViewReturnType<Target, HTMLDivElement> & {
    scrollToTop: () => void;
  },
  'scrollableRef'
> {
  const { scrollableRef, ...rest } = useScrollIntoViewOriginal<
    Target,
    HTMLDivElement
  >(params);
  const globalScrollRef = useContext(GlobalScrollContext);
  const scrollToTop = useCallback(() => {
    if (scrollableRef.current) {
      scrollableRef.current.scrollTop = 0;
    }
  }, []);

  useEffect(() => {
    if (globalScrollRef?.current) {
      scrollableRef.current = globalScrollRef.current;
    }
  }, []);

  return {
    scrollToTop: scrollToTop,
    ...rest,
  };
}

export default useGlobalScrollIntoView;
