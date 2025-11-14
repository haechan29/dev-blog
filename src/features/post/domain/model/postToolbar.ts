import Heading from '@/features/post/domain/model/heading';

export default interface PostToolbar {
  tag: string | null;
  isHeaderVisible: boolean;
  isContentVisible: boolean;
  isScrollingDown: boolean;
  isExpanded: boolean;
  headings: Heading[];
  currentHeading: Heading | null;
  title?: string;
}
