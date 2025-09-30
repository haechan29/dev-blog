'use client';

import { incrementViewCount } from '@/features/postStat/domain/service/postStatService';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useEffect } from 'react';

export default function useViewTracker({ slug }: { slug: string }) {
  const [lastViewTime, setLastViewTime] = useLocalStorage(
    `post-view-${slug}`,
    0
  );

  useEffect(() => {
    const now = Date.now();
    if (now - lastViewTime >= 1000 * 60 * 60) {
      incrementViewCount(slug);
      setLastViewTime(now);
    }
  }, [lastViewTime, slug, setLastViewTime]);
}
