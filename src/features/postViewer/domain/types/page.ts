import Heading from '@/features/post/domain/model/heading';
import { Bgm } from '@/features/post/domain/types/bgm';

export interface Page {
  startOffset: number;
  endOffset: number;
  heading: Heading | null;
  bgm: Bgm | null;
  caption?: string;
}
