import PostViewerProps from '@/features/post/ui/postViewerProps';

export interface PostViewer {
  isCommentSectionVisible: boolean;
  isViewerMode: boolean;
}

export function toProps(postViewer: PostViewer): PostViewerProps {
  return {
    isButtonVisible: !postViewer.isCommentSectionVisible,
    isViewerMode: postViewer.isViewerMode,
  };
}
