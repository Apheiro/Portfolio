'use client';
import { useDebouncedCallback, useDisclosure } from '@mantine/hooks';
import {
  type Dispatch,
  type RefObject,
  type SetStateAction,
  createContext,
  useRef,
  useState,
} from 'react';

const MosaicBackgroundContextRef = createContext<{
  parentRef?: RefObject<HTMLDivElement> | undefined;
  setQuantity: Dispatch<SetStateAction<number>>;
  resizing: () => void;
  stopResizing: () => void;
  isResizing: boolean;
  quantity: number;
  isLoading: boolean;
  stopLoading: () => void;
  loading: () => void;
}>({
  parentRef: undefined,
  quantity: 0,
  isResizing: false,
  stopResizing: () => {},
  resizing: () => {},
  setQuantity: () => {},
  isLoading: true,
  stopLoading: () => {},
  loading: () => {},
});

function MosaicBackgroundProvider({
  children,
}: { children: React.ReactNode }) {
  const [quantity, setQuantity] = useState<number>(0);
  const [isResizing, { open: resizing, close: stopResizing }] =
    useDisclosure(false);
  const [isLoading, { open: loading, close: stopLoading }] =
    useDisclosure(true);
  const stopResizingDebounce = useDebouncedCallback(
    stopResizing,
    1000,
  );
  const parentRef = useRef<HTMLDivElement>(null);

  return (
    <MosaicBackgroundContextRef.Provider
      value={{
        parentRef,
        quantity,
        setQuantity,
        isResizing,
        resizing,
        stopResizing: stopResizingDebounce,
        isLoading,
        stopLoading,
        loading,
      }}
    >
      {children}
    </MosaicBackgroundContextRef.Provider>
  );
}

export { MosaicBackgroundProvider, MosaicBackgroundContextRef };
