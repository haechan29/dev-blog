import Heading from '@/features/post/domain/model/heading';
import PostPosition from '@/features/post/domain/model/postPosition';
import { PostViewer } from '@/features/postViewer/domain/model/postViewer';
import { Padding } from '@/types/padding';

export default interface PostViewerProps {
  isButtonVisible: boolean;
  isViewerMode: boolean;
  areBarsVisible: boolean;
  isToolbarExpanded: boolean;
  pageNumber: number | null;
  totalPages: number | null;
  currentHeading: Heading | null;
  advanceMode: 'tts' | 'auto' | null;
  fullscreenScale: number;
  paddingInRem: Padding;
}

export function createProps({
  postViewer,
  postPosition,
}: {
  postViewer: PostViewer;
  postPosition: PostPosition;
}): PostViewerProps {
  return {
    isButtonVisible: !postViewer.isCommentSectionVisible,
    areBarsVisible:
      postViewer.isMouseOnToolbar ||
      postViewer.isMouseOnControlBar ||
      postViewer.isMouseMoved ||
      postViewer.isToolbarExpanded,
    pageNumber:
      postPosition.currentPageIndex !== null
        ? postPosition.currentPageIndex + 1
        : null,
    totalPages:
      postPosition.totalPage !== null ? postPosition.totalPage + 1 : null,
    currentHeading: postPosition.currentHeading,
    ...postViewer,
  };
}
