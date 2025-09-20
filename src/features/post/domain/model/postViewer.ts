import PostViewerProps from '@/features/post/ui/postViewerProps';

export interface PostViewer {
  isCommentSectionVisible: boolean;
  isViewerMode: boolean;
  currentIndex: number;
}

export function toProps(postViewer: PostViewer): PostViewerProps {
  return {
    isButtonVisible: !postViewer.isCommentSectionVisible,
    isViewerMode: postViewer.isViewerMode,
    currentIndex: postViewer.currentIndex,
  };
}
