import PostViewerProps from '@/features/post/ui/postViewerProps';

export interface PostViewer {
  isCommentSectionVisible: boolean;
  isViewerMode: boolean;
  isControlBarVisible: boolean;
  currentIndex: number;
  totalPages: number;
}

export function toProps(postViewer: PostViewer): PostViewerProps {
  return {
    isButtonVisible: !postViewer.isCommentSectionVisible,
    isViewerMode: postViewer.isViewerMode,
    isControlBarVisible: postViewer.isControlBarVisible,
    currentIndex: postViewer.currentIndex,
    totalPages: postViewer.totalPages,
  };
}
