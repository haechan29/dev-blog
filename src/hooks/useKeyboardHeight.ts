'use client';

import { useEffect, useState } from 'react';

export default function useKeyboardHeight() {
  const [keyboardHeight, setKeyboardHeight] = useState<number | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.visualViewport) return;
    const visualViewport = window.visualViewport;

    const updateKeyboardHeight = () => {
      const keyboardHeight = window.innerHeight - visualViewport.height;
      setKeyboardHeight(keyboardHeight);
    };
    visualViewport.addEventListener('resize', updateKeyboardHeight);
    return () =>
      visualViewport.removeEventListener('resize', updateKeyboardHeight);
  }, []);

  return { keyboardHeight } as const;
}
