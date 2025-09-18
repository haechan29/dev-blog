'use client';

import { incrementViewCount } from '@/features/postStat/domain/service/postStatService';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useEffect } from 'react';

export default function PostViewTracker({ postId }: { postId: string }) {
  const [lastViewTime, setLastViewTime] = useLocalStorage(
    `post-view-${postId}`,
    0
  );

  useEffect(() => {
    const now = Date.now();
    if (now - lastViewTime >= 1000 * 60 * 60) {
      incrementViewCount(postId);
      setLastViewTime(now);
    }
  }, [postId, lastViewTime, setLastViewTime]);

  return <></>;
}
