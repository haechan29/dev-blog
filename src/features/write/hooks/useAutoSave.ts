'use client';

import useWritePostForm from '@/features/write/hooks/useWritePostForm';
import useDebounce from '@/hooks/useDebounce';
import { useCallback, useEffect, useMemo, useRef } from 'react';

const AUTO_SAVE_DELAY = 3_000; // debounce delay after user stops typing
const AUTO_SAVE_INTERVAL = 10_000; // periodic save interval from last save
const LOCAL_STORAGE_KEY = 'draft-content';

export default function useAutoSave(postId?: string) {
  const {
    writePostForm: {
      content: { value: content },
    },
  } = useWritePostForm();
  const debounce = useDebounce();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const localStorageKey = useMemo(() => {
    return postId ? `${LOCAL_STORAGE_KEY}-${postId}` : LOCAL_STORAGE_KEY;
  }, [postId]);

  const saveDraft = useCallback(
    (content: string) => {
      if (!content.trim()) return;
      try {
        localStorage.setItem(localStorageKey, content);
      } catch {}

      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = setInterval(
        () => saveDraft(content),
        AUTO_SAVE_INTERVAL
      );
    },
    [localStorageKey]
  );

  const draft = useMemo(() => {
    try {
      return localStorage.getItem(localStorageKey);
    } catch {
      return null;
    }
  }, [localStorageKey]);

  const removeDraft = useCallback(() => {
    try {
      localStorage.removeItem(localStorageKey);
    } catch {}
  }, [localStorageKey]);

  useEffect(() => {
    debounce(() => saveDraft(content), AUTO_SAVE_DELAY);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [content, debounce, saveDraft]);

  return { draft, removeDraft } as const;
}
