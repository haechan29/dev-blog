import Heading from '@/features/post/domain/model/heading';

export interface Page {
  startOffset: number;
  endOffset: number;
  heading: Heading | null;
  caption?: string;
}
