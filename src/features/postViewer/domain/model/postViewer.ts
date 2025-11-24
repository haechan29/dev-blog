import { Page } from '@/features/postViewer/domain/types/page';

export interface PostViewer {
  areCommentsVisible: boolean;
  isViewerMode: boolean;
  isToolbarExpanded: boolean;
  isMouseOnToolbar: boolean;
  isMouseOnControlBar: boolean;
  isMouseMoved: boolean;
  isTouched: boolean;
  isToolbarTouched: boolean;
  isControlBarTouched: boolean;
  isRotationFinished: boolean;
  pages: Page[];
  currentPageIndex: number | null;
}
