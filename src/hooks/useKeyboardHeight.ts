'use client';

import { useEffect, useRef, useState } from 'react';

export default function useKeyboardHeight() {
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const screenHeightRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.visualViewport) return;

    screenHeightRef.current = window.innerHeight;
    const screenHeight = screenHeightRef.current;
    const visualViewport = window.visualViewport;

    const updateKeyboardHeight = () => {
      const keyboardHeight = Math.max(screenHeight - visualViewport.height, 0);
      setKeyboardHeight(keyboardHeight);
    };
    updateKeyboardHeight();
    visualViewport.addEventListener('resize', updateKeyboardHeight);
    return () =>
      visualViewport.removeEventListener('resize', updateKeyboardHeight);
  }, []);

  return { keyboardHeight } as const;
}
