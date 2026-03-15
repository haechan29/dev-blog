import Heading from '@/features/post/domain/types/heading';

export default interface PostToolbar {
  isHeaderVisible: boolean;
  isContentVisible: boolean;
  isExpanded: boolean;
  headings: Heading[];
  title?: string;
}
