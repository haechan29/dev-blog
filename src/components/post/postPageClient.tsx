'use client';

import useContentTracker from '@/features/post/hooks/useContentTracker';
import useHeadingTracker from '@/features/post/hooks/useHeadingTracker';
import usePostToolbarSync from '@/features/post/hooks/usePostToolbarSync';
import useViewTracker from '@/features/post/hooks/useViewTracker';
import { PostProps } from '@/features/post/ui/postProps';

export default function PostPageClient({ post }: { post: PostProps }) {
  useContentTracker();
  useHeadingTracker(post);
  usePostToolbarSync(post);
  useViewTracker(post);

  return null;
}
