import { Heading } from 'mdast';

export interface Page {
  startOffset: number;
  endOffset: number;
  heading: Heading | null;
  caption?: string;
}
