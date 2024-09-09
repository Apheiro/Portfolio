'use client';

import { ScrollArea } from '@/core/ScrollArea';
import { type RefObject, createContext, useRef } from 'react';

const GlobalScrollContext =
  createContext<RefObject<HTMLDivElement> | null>(null);

function GlobalScroll({ children }: { children: React.ReactNode }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <GlobalScrollContext.Provider value={scrollRef}>
      <ScrollArea ref={scrollRef} className='h-dvh'>
        {children}
      </ScrollArea>
    </GlobalScrollContext.Provider>
  );
}

export { GlobalScroll, GlobalScrollContext };
