import usePostViewer from '@/features/postViewer/hooks/usePostViewer';
import useViewerToolbar from '@/features/postViewer/hooks/useViewerToolbar';
import { scrollToElement } from '@/lib/scroll';
import { useEffect } from 'react';

export default function useScrollOnHeadingChange() {
  const { isViewerMode } = usePostViewer();
  const { currentHeading } = useViewerToolbar();

  useEffect(() => {
    if (!isViewerMode || !currentHeading) return;
    const element = document.getElementById(currentHeading.id);
    if (element) {
      scrollToElement(element);
    }
  }, [currentHeading, isViewerMode]);
}
