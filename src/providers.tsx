'use client';

import { store } from '@/lib/redux/store';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { usePathname, useSearchParams } from 'next/navigation';
import nProgress from 'nprogress';
import { ReactNode, useEffect, useState } from 'react';
import { Provider } from 'react-redux';

export default function Providers({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            retry: 1,
          },
        },
      })
  );

  useEffect(() => {
    nProgress.done();
  }, [pathname, searchParams]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a');

      if (
        link &&
        link.href &&
        link.href.startsWith(window.location.origin) &&
        link.pathname !== pathname
      ) {
        nProgress.start();
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [pathname]);

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </Provider>
  );
}
