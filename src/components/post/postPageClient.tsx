'use client';

import useContentTracker from '@/features/post/hooks/useContentTracker';
import useHeadingTracker from '@/features/post/hooks/useHeadingTracker';
import useToolbarSync from '@/features/post/hooks/useToolbarSync';
import useViewTracker from '@/features/post/hooks/useViewTracker';
import { PostItemProps } from '@/features/post/ui/postItemProps';

export default function PostPageClient({ post }: { post: PostItemProps }) {
  useContentTracker();
  useHeadingTracker(post);
  useToolbarSync(post);
  useViewTracker(post);

  return null;
}
