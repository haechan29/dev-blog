'use client';

import { useCallback, useEffect, useRef } from 'react';

export default function useDebounce(timeoutMillis: number) {
  const timer = useRef<NodeJS.Timeout | null>(null);

  const debounce = useCallback(
    (block: () => void) => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
      timer.current = setTimeout(block, timeoutMillis);
    },
    [timeoutMillis]
  );

  useEffect(() => {
    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
    };
  }, []);

  return debounce;
}
