'use client';

import useDebounce from '@/hooks/useDebounce';
import { processMd } from '@/lib/md';
import { useCallback, useEffect, useState } from 'react';

export default function useParseHtml({ value: content }: { value: string }) {
  const [htmlSource, setHtmlSource] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);
  const debounce = useDebounce();

  const parseMd = useCallback(async () => {
    setIsError(false);
    try {
      const result = await processMd(content);
      setHtmlSource(result);
    } catch {
      setIsError(true);
    }
  }, [content]);

  useEffect(() => {
    debounce(() => {
      parseMd();
    }, 300);
  }, [debounce, parseMd]);

  return {
    htmlSource,
    isError,
  } as const;
}
