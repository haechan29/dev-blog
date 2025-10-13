'use client';

import usePostToolbarSync from '@/features/post/hooks/usePostToolbarSync';
import useScrollOnHeadingChange from '@/features/post/hooks/useScrollOnHeadingChange';
import useViewTracker from '@/features/post/hooks/useViewTracker';
import { PostProps } from '@/features/post/ui/postProps';

export default function PostPageClient({ post }: { post: PostProps }) {
  usePostToolbarSync(post);
  useViewTracker(post);
  useScrollOnHeadingChange();

  return null;
}
