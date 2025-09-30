'use client';

import useContentTracker from '@/features/post/hooks/useContentTracker';
import useHeadingTracker from '@/features/post/hooks/useHeadingTracker';
import useToolbarSync from '@/features/post/hooks/useToolbarSync';
import useViewTracker from '@/features/post/hooks/useViewTracker';
import { PostProps } from '@/features/post/ui/postProps';

export default function PostPageClient({ post }: { post: PostProps }) {
  useContentTracker();
  useHeadingTracker(post);
  useToolbarSync(post);
  useViewTracker(post);

  return null;
}
