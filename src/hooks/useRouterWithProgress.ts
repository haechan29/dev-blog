import { useRouter } from 'next/navigation';
import nProgress from 'nprogress';
import { useCallback, useMemo } from 'react';

export default function useRouterWithProgress() {
  const router = useRouter();

  const push = useCallback(
    (href: string) => {
      const currentUrl = window.location.pathname + window.location.search;
      if (href === currentUrl) return;

      nProgress.start();
      router.push(href);
    },
    [router]
  );

  const replace = useCallback(
    (href: string) => {
      const currentUrl = window.location.pathname + window.location.search;
      if (href === currentUrl) return;

      nProgress.start();
      router.replace(href);
    },
    [router]
  );

  return useMemo(
    () => ({
      ...router,
      push,
      replace,
    }),
    [router, push, replace]
  );
}
