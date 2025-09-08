'use client';

import { useRef } from 'react';

export default function useThrottle<T>(timeoutInMillis: number) {
  const lastCallTime = useRef<number>(0);

  return [
    (block: () => T) => {
      const now = Date.now();

      if (now - lastCallTime.current >= timeoutInMillis) {
        lastCallTime.current = now;
        return block();
      }
    },
  ];
}
