import Heading from '@/features/post/domain/model/heading';
import PostPosition from '@/features/post/domain/model/postPosition';
import { PostViewer } from '@/features/postViewer/domain/model/postViewer';

export default interface PostViewerProps {
  isButtonVisible: boolean;
  isViewerMode: boolean;
  areBarsVisible: boolean;
  isToolbarExpanded: boolean;
  pageNumber: number | null;
  totalPages: number | null;
  currentHeading: Heading | null;
}

export function createProps({
  postViewer,
  postPosition,
}: {
  postViewer: PostViewer;
  postPosition: PostPosition;
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
    pageNumber: postPosition.currentPageIndex + 1,
    totalPages: postPosition.pages.length + 1,
    currentHeading: postPosition.currentHeading,
    ...postViewer,
  };
}
