'use client';

import usePostsToolbarSync from '@/features/post/hooks/usePostsToolbarSync';

export default function PostsPageClient() {
  usePostsToolbarSync();

  return null;
}
