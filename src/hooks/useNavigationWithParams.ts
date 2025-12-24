import useRouterWithProgress from '@/hooks/useRouterWithProgress';
import { usePathname, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

export default function useNavigationWithParams() {
  const prevPathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouterWithProgress();

  const navigate = useCallback(
    ({
      pathname = prevPathname,
      setParams,
      keepExisting = false,
    }: {
      pathname?: string;
      setParams?: Record<string, string>;
      keepExisting?: boolean;
    }) => {
      const params = new URLSearchParams(
        keepExisting ? searchParams : undefined
      );

      if (setParams) {
        Object.entries(setParams).forEach(([key, value]) =>
          params.set(key, value)
        );
      }

      const queryString = params.toString();
      const url = queryString ? `${pathname}?${queryString}` : pathname;
      router.push(url);
    },
    [router, searchParams, prevPathname]
  );

  return navigate;
}
