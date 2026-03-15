import { formatDate } from '@/features/post/domain/lib/date';
import { extractPlainText } from '@/features/post/domain/lib/parse';
import Post from '@/features/post/domain/model/post';
import Heading from '@/features/post/domain/types/heading';
import { PostVisibility } from '@/features/post/domain/types/postVisibility';
import { toUserNickname } from '@/features/user/ui/userProps';
import { JSONContent } from '@tiptap/core';

export interface PostProps {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  content: string;
  contentJson: JSONContent | null;
  headings: Heading[];
  plainText: string;
  userId: string;
  authorName: string;
  bio: string | null;
  profileImageUrl: string | null;
  seriesId: string | null;
  seriesOrder: number | null;
  seriesTitle: string | null;
  likeCount: number;
  viewCount: string | null;
  visibility: PostVisibility;
}

export function createProps(post: Post): PostProps {
  return {
    id: post.id,
    title: post.title,
    createdAt: formatDate(post.createdAt),
    updatedAt: formatDate(post.updatedAt),
    tags: post.tags,
    content: post.content,
    contentJson: post.contentJson,
    headings: post.headings,
    plainText: extractPlainText(post.content),
    userId: post.userId,
    authorName: toUserNickname({ id: post.userId, nickname: post.authorName }),
    bio: post.bio,
    profileImageUrl: post.profileImageUrl,
    seriesId: post.seriesId,
    seriesOrder: post.seriesOrder,
    seriesTitle: post.seriesTitle,
    likeCount: post.likeCount,
    viewCount: formatViewCount(post.viewCount),
    visibility: post.visibility,
  };
}

export function formatViewCount(viewCount: number): string | null {
  if (viewCount < 100) return null;
  if (viewCount < 1000) return `${Math.floor(viewCount / 100) * 100}+`;
  return `${(viewCount / 1000).toFixed(1).replace(/\.0$/, '')}K+`;
}
