'use client';

import { useCallback, useRef } from 'react';

export default function useThrottle(timeoutInMillis: number) {
  const lastCallTime = useRef<number>(0);

  const throttle = useCallback(
    (block: () => void) => {
      const now = Date.now();

      if (now - lastCallTime.current >= timeoutInMillis) {
        lastCallTime.current = now;
        return block();
      }
    },
    [timeoutInMillis]
  );

  return throttle;
}
