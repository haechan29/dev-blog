'use client';

import useHeadingTracker from '@/features/post/hooks/useHeadingTracker';
import usePostToolbarSync from '@/features/post/hooks/usePostToolbarSync';
import useScrollOnHeadingChange from '@/features/post/hooks/useScrollOnHeadingChange';
import useViewTracker from '@/features/post/hooks/useViewTracker';
import { PostProps } from '@/features/post/ui/postProps';
import usePostViewer from '@/features/postViewer/hooks/usePostViewer';
import useScrollLock from '@/hooks/useScrollLock';

export default function PostPageClient({ post }: { post: PostProps }) {
  const { isViewerMode } = usePostViewer();

  useHeadingTracker(post);
  usePostToolbarSync(post);
  useViewTracker(post);
  useScrollOnHeadingChange();
  useScrollLock(isViewerMode);

  return null;
}
