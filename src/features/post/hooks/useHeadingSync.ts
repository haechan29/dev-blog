import useHeadingTracker from '@/features/post/hooks/useHeadingTracker';
import { PostProps } from '@/features/post/ui/postProps';
import usePostViewer from '@/features/postViewer/hooks/usePostViewer';
import { setCurrentHeading } from '@/lib/redux/post/postPositionSlice';
import { AppDispatch } from '@/lib/redux/store';
import { scrollIntoElement } from '@/lib/scroll';
import { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';

export default function useHeadingSync(post: PostProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { currentHeading, isViewerMode } = usePostViewer();
  const { heading } = useHeadingTracker(post);

  const scrollToCurrentHeading = useCallback(() => {
    if (!currentHeading) return;

    const element = document.getElementById(currentHeading.id);
    if (!element) return;

    scrollIntoElement(element);
  }, [currentHeading]);

  useEffect(() => {
    if (isViewerMode) {
      scrollToCurrentHeading();
    } else {
      dispatch(setCurrentHeading(heading));
    }
  }, [dispatch, heading, isViewerMode, scrollToCurrentHeading]);
}
