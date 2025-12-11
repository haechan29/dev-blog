import { formatDate } from '@/features/post/domain/lib/date';
import { extractPlainText } from '@/features/post/domain/lib/parse';
import Heading from '@/features/post/domain/model/heading';
import Post from '@/features/post/domain/model/post';

export type PostProps = {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  content: string;
  headings: Heading[];
  plainText: string;
  userId: string;
  authorName: string;
  isDeleted: boolean;
  seriesId: string | null;
  seriesOrder: number | null;
  seriesTitle: string | null;
};

export function createProps(post: Post): PostProps {
  return {
    id: post.id,
    title: post.title,
    createdAt: formatDate(post.createdAt),
    updatedAt: formatDate(post.updatedAt),
    tags: post.tags,
    content: post.content,
    headings: post.headings,
    plainText: extractPlainText(post.content),
    userId: post.userId,
    authorName: post.authorName,
    isDeleted: post.isDeleted,
    seriesId: post.seriesId,
    seriesOrder: post.seriesOrder,
    seriesTitle: post.seriesTitle,
  };
}
