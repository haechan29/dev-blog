import Heading from '@/features/post/domain/model/heading';
import { Page } from '@/features/postViewer/domain/types/page';

export default interface PostPosition {
  currentHeading: Heading | null;
  pages: Page[];
  currentPageIndex: number;
}
