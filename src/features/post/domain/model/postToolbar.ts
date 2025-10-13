import Heading from '@/features/post/domain/model/heading';

export default interface PostToolbar {
  tag: string | null;
  isInPostsPage: boolean;
  isHeaderVisible: boolean;
  isContentVisible: boolean;
  isScrollingDown: boolean;
  isExpanded: boolean;
  headings: Heading[];
  title?: string;
}
