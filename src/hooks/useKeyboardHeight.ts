'use client';

import useThrottle from '@/hooks/useThrottle';
import { useEffect, useRef, useState } from 'react';

export default function useKeyboardHeight() {
  const viewportHeightRef = useRef<number | null>(null);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const throttle = useThrottle();

  useEffect(() => {
    if (!window.visualViewport) return;
    const visualViewport = window.visualViewport;

    const updateKeyboardHeight = () => {
      throttle(() => {
        if (viewportHeightRef.current === null && visualViewport.height !== 0) {
          viewportHeightRef.current = visualViewport.height;
        }
        const screenHeight = window.innerHeight;
        const viewportHeight = viewportHeightRef.current;
        if (!screenHeight || !viewportHeight) return;

        const keyboardHeight = Math.max(screenHeight - viewportHeight, 0);
        setKeyboardHeight(keyboardHeight);
      }, 100);
    };

    window.addEventListener('scroll', updateKeyboardHeight);
    visualViewport.addEventListener('resize', updateKeyboardHeight);
    return () => {
      window.removeEventListener('scroll', updateKeyboardHeight);
      visualViewport.removeEventListener('resize', updateKeyboardHeight);
    };
  }, [throttle]);

  return { keyboardHeight } as const;
}
