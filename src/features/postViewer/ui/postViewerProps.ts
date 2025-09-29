import { HeadingPageMapping } from '@/features/postViewer/domain/types/headingPageMapping';

export default interface PostViewerProps {
  isButtonVisible: boolean;
  isViewerMode: boolean;
  areBarsVisible: boolean;
  isToolbarExpanded: boolean;
  pageNumber: number | null;
  totalPages: number | null;
  advanceMode: 'tts' | 'auto' | null;
  fullscreenScale: number;
  headingPageMapping?: HeadingPageMapping;
}
