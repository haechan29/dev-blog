import { HeadingPageMapping } from '@/features/postViewer/domain/types/headingPageMapping';
import { Paing } from '@/features/postViewer/domain/types/paging';
import PostViewerProps from '@/features/postViewer/ui/postViewerProps';

export interface PostViewer {
  isCommentSectionVisible: boolean;
  isViewerMode: boolean;
  isControlBarVisible: boolean;
  paging: Paing | null;
  advanceMode: 'tts' | 'auto' | null;
  fullscreenScale: number;
  headingPageMapping?: HeadingPageMapping;
}

export function toProps(postViewer: PostViewer): PostViewerProps {
  return {
    isButtonVisible: !postViewer.isCommentSectionVisible,
    isViewerMode: postViewer.isViewerMode,
    isControlBarVisible: postViewer.isControlBarVisible,
    pageNumber: postViewer.paging ? postViewer.paging.index + 1 : null,
    totalPages: postViewer.paging ? postViewer.paging.total + 1 : null,
    advanceMode: postViewer.advanceMode,
    fullscreenScale: postViewer.fullscreenScale,
    headingPageMapping: postViewer.headingPageMapping,
  };
}
