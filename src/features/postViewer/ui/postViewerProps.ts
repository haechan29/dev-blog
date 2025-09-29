import { HeadingPageMap } from '@/features/postViewer/domain/types/headingPageMap';

export default interface PostViewerProps {
  isButtonVisible: boolean;
  isViewerMode: boolean;
  isControlBarVisible: boolean;
  pageNumber: number | null;
  totalPages: number | null;
  advanceMode: 'tts' | 'auto' | null;
  fullscreenScale: number;
  headingPageMap?: HeadingPageMap;
}
