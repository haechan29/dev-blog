export interface PostViewer {
  isCommentSectionVisible: boolean;
  isViewerMode: boolean;
  isToolbarExpanded: boolean;
  advanceMode: 'tts' | 'auto' | null;
  isMouseOnToolbar: boolean;
  isMouseOnControlBar: boolean;
  isMouseMoved: boolean;
  isTouched: boolean;
}
