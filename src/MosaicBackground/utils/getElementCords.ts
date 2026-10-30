import type { RefObject } from 'react';

function getElementCords(ref: RefObject<HTMLElement>): ElementCords {
  const { scrollTop, scrollLeft } = document.querySelector(
    '#global-scroll>div',
  );
  if (ref.current) {
    const { bottom, top, left, right, width, height } =
      ref.current.getBoundingClientRect();
    return {
      y: { top: top + scrollTop, bottom: bottom + scrollTop },
      x: { left: left + scrollLeft, right: right + scrollLeft },
      size: { width, height },
    };
  }
  return {
    y: { top: 0, bottom: 0 },
    x: { left: 0, right: 0 },
    size: { width: 0, height: 0 },
  };
}

export default getElementCords;
