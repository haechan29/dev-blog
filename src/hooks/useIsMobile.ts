'use client';

import { useEffect, useState } from 'react';

export default function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkDivice = () => setIsMobile('ontouchstart' in window);
    checkDivice();
    window.addEventListener('resize', checkDivice);
    return () => window.removeEventListener('resize', checkDivice);
  }, []);

  return isMobile;
}
