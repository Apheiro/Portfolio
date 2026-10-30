import { useCallback, useEffect } from 'react';

export default function useDidResize(
  callback: (width: number, height: number, e: UIEvent) => void,
  ref?: React.RefObject<HTMLElement>,
) {
  const memoCallback = useCallback(callback, []);

  useEffect(() => {
    const resizeFn = (event: UIEvent) => {
      if (ref?.current) {
        const { clientWidth: width, clientHeight: height } =
          ref.current;
        memoCallback(width, height, event);
      } else {
        const { innerWidth: width, innerHeight: height } = window;
        memoCallback(width, height, event);
      }
    };

    window.addEventListener('resize', resizeFn);
    return () => {
      window.removeEventListener('resize', resizeFn);
    };
  }, []);
}
