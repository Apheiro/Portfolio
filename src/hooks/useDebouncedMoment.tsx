import { useDebouncedCallback, useDisclosure } from '@mantine/hooks';
import { useCallback } from 'react';

// interface DebouncedMoment {

// }

export default function (
  startValue: boolean,
  timeout?: number,
): [boolean, () => void] {
  const [isEnable, { open, close }] = useDisclosure(startValue);
  const toggleDebounce = useDebouncedCallback(
    startValue ? open : close,
    timeout ?? 1000,
  );
  const momentaryToggle = useCallback(() => {
    if (startValue) close();
    else open();
    toggleDebounce();
  }, []);
  return [isEnable, momentaryToggle];
}
