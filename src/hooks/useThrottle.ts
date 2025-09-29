'use client';

import { useCallback, useRef } from 'react';

export default function useThrottle() {
  const lastCallTime = useRef<number>(0);

  const throttle = useCallback((block: () => void, timeoutInMillis: number) => {
    const now = Date.now();

    if (now - lastCallTime.current >= timeoutInMillis) {
      lastCallTime.current = now;
      return block();
    }
  }, []);

  return throttle;
}
