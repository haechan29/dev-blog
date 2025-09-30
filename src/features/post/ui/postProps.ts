import { formatDate } from '@/features/post/domain/lib/date';
import { extractPlainText } from '@/features/post/domain/lib/parse';
import Heading from '@/features/post/domain/model/heading';
import Post from '@/features/post/domain/model/post';

export type PostProps = {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  content: string;
  headings: Heading[];
  plainText: string;
};

export function createPostProps(post: Post): PostProps {
  return {
    slug: post.slug,
    title: post.title,
    date: formatDate(post.date),
    tags: post.tags ?? [],
    content: post.content,
    headings: post.headings,
    plainText: extractPlainText(post.content),
  };
}
