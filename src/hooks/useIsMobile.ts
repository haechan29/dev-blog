'use client';

import { useEffect, useState } from 'react';

export default function useIsMobile() {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && 'ontouchstart' in window
  );

  const checkDivice = () =>
    setIsMobile(typeof window !== 'undefined' && 'ontouchstart' in window);
  useEffect(() => {
    window.addEventListener('resize', checkDivice);
    return () => window.removeEventListener('resize', checkDivice);
  }, []);

  return isMobile;
}
