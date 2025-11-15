import Heading from '@/features/post/domain/model/heading';

export default interface PostReader {
  mode: 'parsed' | 'raw';
  currentHeading: Heading | null;
}
