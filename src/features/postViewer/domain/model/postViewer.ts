import PostViewerProps from '@/features/postViewer/ui/postViewerProps';

export interface PostViewer {
  isCommentSectionVisible: boolean;
  isViewerMode: boolean;
  isControlBarVisible: boolean;
  pageIndex: number;
  totalPages: number;
  advanceMode: 'tts' | 'auto' | null;
}

export function toProps(postViewer: PostViewer): PostViewerProps {
  return {
    isButtonVisible: !postViewer.isCommentSectionVisible,
    isViewerMode: postViewer.isViewerMode,
    isControlBarVisible: postViewer.isControlBarVisible,
    pageIndex: postViewer.pageIndex,
    totalPages: postViewer.totalPages,
    advanceMode: postViewer.advanceMode,
  };
}
