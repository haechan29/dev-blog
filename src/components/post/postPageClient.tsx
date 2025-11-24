'use client';

import useBgmController from '@/features/post/hooks/useBgmController';
import usePostToolbarSync from '@/features/post/hooks/usePostToolbarSync';
import useViewTracker from '@/features/post/hooks/useViewTracker';
import { PostProps } from '@/features/post/ui/postProps';

export default function PostPageClient({ post }: { post: PostProps }) {
  usePostToolbarSync(post);
  useViewTracker({ ...post });
  useBgmController();

  return null;
}
