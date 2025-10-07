import { Padding } from '@/types/padding';

export interface PostViewer {
  isCommentSectionVisible: boolean;
  isViewerMode: boolean;
  isToolbarExpanded: boolean;
  advanceMode: 'tts' | 'auto' | null;
  fullscreenScale: number;
  paddingInRem: Padding;
  isMouseOnToolbar: boolean;
  isMouseOnControlBar: boolean;
  isMouseMoved: boolean;
}
