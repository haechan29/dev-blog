import { PostViewer } from '@/features/postViewer/domain/model/postViewer';

export default interface PostViewerProps {
  isButtonVisible: boolean;
  isViewerMode: boolean;
  areBarsVisible: boolean;
  isToolbarExpanded: boolean;
  pageNumber: number | null;
  totalPages: number | null;
}

export function createProps({
  postViewer,
}: {
  postViewer: PostViewer;
}): PostViewerProps {
  return {
    isButtonVisible: !postViewer.areCommentsVisible && !postViewer.isViewerMode,
    areBarsVisible:
      postViewer.isMouseOnToolbar ||
      postViewer.isMouseOnControlBar ||
      postViewer.isMouseMoved ||
      postViewer.isToolbarExpanded ||
      postViewer.isTouched ||
      postViewer.isToolbarTouched ||
      postViewer.isControlBarTouched ||
      postViewer.isRotationFinished,
    pageNumber: postViewer.currentPageIndex + 1,
    totalPages: postViewer.pages.length + 1,
    ...postViewer,
  };
}
