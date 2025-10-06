import { Padding } from '@/types/padding';

export interface PostViewer {
  isCommentSectionVisible: boolean;
  isViewerMode: boolean;
  areBarsVisible: boolean;
  isToolbarExpanded: boolean;
  advanceMode: 'tts' | 'auto' | null;
  fullscreenScale: number;
  paddingInRem: Padding;
}
