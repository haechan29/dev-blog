'use client';

import { incrementViewCount } from '@/features/postStat/domain/service/postStatService';
import { useEffect } from 'react';

export default function PostViewTracker({ postId }: { postId: string }) {
  useEffect(() => {
    try {
      const item = localStorage.getItem(`post-view-${postId}`);
      if (!item) return;

      const now = Date.now();
      const lastViewTime = JSON.parse(item);

      if (now - lastViewTime >= 1000 * 60 * 60) {
        incrementViewCount(postId);
        localStorage.setItem(`post-view-${postId}`, JSON.stringify(now));
      }
    } catch {}
  }, [postId]);

  return <></>;
}
