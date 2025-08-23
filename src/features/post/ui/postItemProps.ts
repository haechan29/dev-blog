import { Heading } from '../domain/post';

export type PostItemProps = {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  content: string;
  headings: Heading[];
  plainText: string;
}