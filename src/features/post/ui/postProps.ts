import { formatDate } from '@/features/post/domain/lib/date';
import { extractPlainText } from '@/features/post/domain/lib/parse';
import Heading from '@/features/post/domain/model/heading';
import Post from '@/features/post/domain/model/post';

export type PostProps = {
  postId: string;
  title: string;
  createdAt: string;
  tags: string[];
  content: string;
  headings: Heading[];
  plainText: string;
};

export function createProps(post: Post): PostProps {
  return {
    postId: post.postId,
    title: post.title,
    createdAt: formatDate(post.createdAt),
    tags: post.tags,
    content: post.content,
    headings: post.headings,
    plainText: extractPlainText(post.content),
  };
}
