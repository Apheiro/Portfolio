'use client';

import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { cva } from 'cva';
import * as React from 'react';

const tooltipStyle = cva({
  base: [
    'z-50',
    'overflow-hidden',
    'rounded-md',
    'border',
    'border-white/10',
    'bg-black',
    'px-3',
    'py-1.5',
    'text-sm',
    'shadow-md',
    'animate-in',
    'data-[state=closed]:animate-out',
    'data-[side=bottom]:slide-from-top-2',
    'data-[side=left]:slide-from-right-2',
    'data-[side=right]:slide-from-left-2',
    'data-[side=top]:slide-from-bottom-2',
  ],
});

const TooltipProvider = TooltipPrimitive.Provider;

const Tooltip = TooltipPrimitive.Root;

const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={tooltipStyle({ className })}
    {...props}
  />
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

interface TooltipWrapperProps {
  children: JSX.Element;
  content?: string | JSX.Element;
  tooltipDelay?: number;
  tooltipPosition?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

const TooltipWrapper = ({
  children,
  content,
  tooltipDelay,
  tooltipPosition,
  className,
}: TooltipWrapperProps) => {
  return (
    <Tooltip delayDuration={tooltipDelay}>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side={tooltipPosition} className={className}>
        {typeof content === 'string' ? <p>{content}</p> : content}
      </TooltipContent>
    </Tooltip>
  );
};

export {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
  TooltipWrapper,
};
