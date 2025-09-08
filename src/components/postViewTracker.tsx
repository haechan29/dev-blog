'use client';

import { PostItemProps } from '@/features/post/ui/postItemProps';
import { incrementViewCount } from '@/features/postStat/domain/service/postStatService';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useEffect } from 'react';

export default function PostViewTracker({ post }: { post: PostItemProps }) {
  const [lastViewTime, setLastViewTime] = useLocalStorage(
    `post-view-${post.slug}`,
    0
  );

  useEffect(() => {
    const now = Date.now();
    if (now - lastViewTime >= 1000 * 60 * 60) {
      incrementViewCount(post.slug);
      setLastViewTime(now);
    }
  }, [post.slug, lastViewTime, setLastViewTime]);

  return <></>;
}
