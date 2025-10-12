'use client';

import useContentTracker from '@/features/post/hooks/useContentTracker';
import useHeadingTracker from '@/features/post/hooks/useHeadingTracker';
import usePostToolbarSync from '@/features/post/hooks/usePostToolbarSync';
import useScrollOnHeadingChange from '@/features/post/hooks/useScrollOnHeadingChange';
import useSwipeTracker from '@/features/post/hooks/useSwipeTracker';
import useViewTracker from '@/features/post/hooks/useViewTracker';
import { PostProps } from '@/features/post/ui/postProps';
import usePostViewer from '@/features/postViewer/hooks/usePostViewer';
import useScrollLock from '@/hooks/useScrollLock';

export default function PostPageClient({ post }: { post: PostProps }) {
  const { isViewerMode } = usePostViewer();

  useHeadingTracker(post);
  useContentTracker();
  useSwipeTracker();
  usePostToolbarSync(post);
  useViewTracker(post);
  useScrollOnHeadingChange();
  useScrollLock(isViewerMode);

  return null;
}
