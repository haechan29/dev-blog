import { Page } from '@/features/postViewer/domain/types/page';

export interface PostViewer {
  isViewerMode: boolean;
  pages: Page[];
  currentPageIndex: number | null;
}
