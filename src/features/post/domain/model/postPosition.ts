import Heading from '@/features/post/domain/model/heading';
import { HeadingPageMapping } from '@/features/postViewer/domain/types/headingPageMapping';

export default interface PostPosition {
  currentHeading: Heading | null;
  currentPageIndex: number | null;
  totalPage: number | null;
  headingPageMapping: HeadingPageMapping | null;
}
