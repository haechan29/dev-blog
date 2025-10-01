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
  advanceMode: 'tts' | 'auto' | null;
  fullscreenScale: number;
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
    isViewerMode: postViewer.isViewerMode,
    areBarsVisible: postViewer.areBarsVisible,
    isToolbarExpanded: postViewer.isToolbarExpanded,
    pageNumber:
      postPosition.currentPageIndex !== null
        ? postPosition.currentPageIndex + 1
        : null,
    totalPages:
      postPosition.totalPage !== null ? postPosition.totalPage + 1 : null,
    currentHeading: postPosition.currentHeading,
    advanceMode: postViewer.advanceMode,
    fullscreenScale: postViewer.fullscreenScale,
  };
}
