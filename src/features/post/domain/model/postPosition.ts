import { Page } from '@/features/postViewer/domain/types/page';

export default interface PostPosition {
  pages: Page[];
  currentPageIndex: number;
}
