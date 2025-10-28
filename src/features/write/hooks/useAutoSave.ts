'use client';

import useDebounce from '@/hooks/useDebounce';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useCallback, useEffect, useRef } from 'react';

const AUTO_SAVE_DELAY = 3_000; // debounce delay after user stops typing
const AUTO_SAVE_INTERVAL = 10_000; // periodic save interval from last save

export default function useAutoSave({ value: content }: { value: string }) {
  const debounce = useDebounce();
  const [_, setContent] = useLocalStorage('draft-content', content);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const saveContent = useCallback(
    (content: string) => {
      setContent(content);

      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = setInterval(
        () => saveContent(content),
        AUTO_SAVE_INTERVAL
      );
    },
    [setContent]
  );

  useEffect(() => {
    debounce(() => saveContent(content), AUTO_SAVE_DELAY);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [content, debounce, saveContent]);
}
