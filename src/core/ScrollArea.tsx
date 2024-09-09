'use client';
import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area';
import { cva } from 'cva';
import {
  type ComponentPropsWithoutRef,
  type ElementRef,
  forwardRef,
} from 'react';

const scrollArea = cva({
  base: ['relative', 'overflow-hidden'],
});
const scrollAreaViewport = cva({
  base: ['h-full', 'w-full'],
});
const scrollbar = cva({
  base: ['flex', 'touch-none', 'select-none', 'transition-colors'],
  variants: {
    orientation: {
      vertical: [
        'h-full',
        'w-2.5',
        'border-l',
        'border-l-transparent',
        'p-[1px]',
      ],
      horizontal: [
        'w-full',
        'h-2.5',
        'border-t',
        'border-t-transparent',
        'p-[1px]',
      ],
    },
  },
});
const scrollBarThumb = cva({
  base: [
    'relative',
    'rounded-full',
    'transition-colors',
    'duration-500',
    'bg-white/40',
    'hover:bg-white/40',
    'z-[5]',
  ],
  variants: {
    orientation: {
      vertical: ['flex-1'],
      horizontal: [],
    },
  },
});

interface ScrollAreaProps
  extends ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root> {
  classNameViewport?: string;
  thumbClassName?: string;
  orientation?: 'vertical' | 'horizontal';
}
interface ScrollBarProps
  extends ComponentPropsWithoutRef<
    typeof ScrollAreaPrimitive.ScrollAreaScrollbar
  > {
  thumbClassName?: string;
}

const ScrollArea = forwardRef<
  ElementRef<typeof ScrollAreaPrimitive.Root>,
  ScrollAreaProps
>(
  (
    {
      className,
      children,
      orientation = 'vertical',
      classNameViewport,
      thumbClassName,
      asChild,
      ...props
    },
    ref,
  ) => (
    <ScrollAreaPrimitive.Root
      className={scrollArea({ className })}
      {...props}
    >
      <ScrollAreaPrimitive.Viewport
        ref={ref}
        className={scrollAreaViewport({
          className: classNameViewport,
        })}
        asChild={asChild}
      >
        {children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollBar
        orientation={orientation}
        thumbClassName={thumbClassName}
      />
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  ),
);
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName;

const ScrollBar = forwardRef<
  ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
  ScrollBarProps
>(({ className, orientation, thumbClassName, ...props }, ref) => (
  <ScrollAreaPrimitive.ScrollAreaScrollbar
    ref={ref}
    orientation={orientation}
    className={scrollbar({ className, orientation })}
    {...props}
  >
    <ScrollAreaPrimitive.ScrollAreaThumb
      className={scrollBarThumb({
        className: thumbClassName,
        orientation,
      })}
    />
  </ScrollAreaPrimitive.ScrollAreaScrollbar>
));
ScrollBar.displayName =
  ScrollAreaPrimitive.ScrollAreaScrollbar.displayName;

export { ScrollArea, ScrollBar };
