'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ReactNode, useEffect, useMemo } from 'react';

/**
 * Validates query parameters with configurable fallback behavior.
 * Renders children if valid, otherwise handles fallback (default value, redirect, or null).
 */
export default function QueryParamsValidator({
  queryKey,
  isValidValue,
  children,
  fallbackOption,
}: {
  queryKey: string;
  isValidValue: (value: string | null) => boolean;
  children: ReactNode;
  fallbackOption?:
    | { type: 'redirectTo'; url: string }
    | { type: 'defaultValue'; value: string };
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const value = searchParams.get(queryKey);
  const isValid = useMemo(() => isValidValue(value), [isValidValue, value]);

  useEffect(() => {
    if (isValid || fallbackOption === undefined) return;
    switch (fallbackOption.type) {
      case 'redirectTo': {
        router.push(fallbackOption.url);
        break;
      }
      case 'defaultValue': {
        const params = new URLSearchParams(searchParams);
        params.set(queryKey, fallbackOption.value);
        router.push(`${pathname}?${params.toString()}`);
        break;
      }
    }
  }, [fallbackOption, isValid, pathname, queryKey, router, searchParams]);

  return isValid ? children : null;
}
