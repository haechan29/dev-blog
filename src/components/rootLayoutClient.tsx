'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import nProgress from 'nprogress';
import { useEffect } from 'react';

export default function RootLayoutClient() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    nProgress.done();
  }, [pathname, searchParams]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a');

      if (link && link.href && link.href.startsWith(window.location.origin)) {
        nProgress.start();
        const url = new URL(link.href);
        if (url.pathname === pathname) {
          setTimeout(() => nProgress.done(), 300);
        }
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [pathname]);

  return null;
}
