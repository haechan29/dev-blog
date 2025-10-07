'use client';

import { incrementViewCount } from '@/features/postStat/domain/service/postStatService';
import { useCallback, useEffect } from 'react';

export default function useViewTracker({ slug }: { slug: string }) {
  const key = `post-view-${slug}`;

  const getLastViewTime = useCallback(() => {
    const item = localStorage.getItem(key);
    if (item) {
      try {
        return JSON.parse(item) as number;
      } catch {}
    }
  }, [key]);

  const setLastViewTime = useCallback(() => {
    const now = Date.now();
    localStorage.setItem(key, JSON.stringify(now));
  }, [key]);

  useEffect(() => {
    const now = Date.now();
    const lastViewTime = getLastViewTime();

    if (lastViewTime === undefined || now - lastViewTime >= 1000 * 60 * 60) {
      incrementViewCount(slug);
      setLastViewTime();
    }
  }, [getLastViewTime, setLastViewTime, slug]);
}
