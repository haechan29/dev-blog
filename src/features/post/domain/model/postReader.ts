import Heading from '@/features/post/domain/types/heading';

export default interface PostReader {
  mode: 'parsed' | 'raw';
  currentHeading: Heading | null;
}
