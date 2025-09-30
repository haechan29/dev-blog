'use client';

import useContentTracker from '@/features/post/hooks/useContentTracker';
import useHeadingTracker from '@/features/post/hooks/useScrollHeadingTracker';
import { PostItemProps } from '@/features/post/ui/postItemProps';
import { useMemo } from 'react';

export default function PostPageClient({ post }: { post: PostItemProps }) {
  const headings = useMemo(
    () => post.headings.filter(heading => heading.level === 1),
    [post.headings]
  );

  useContentTracker();
  useHeadingTracker(headings);

  return null;
}
