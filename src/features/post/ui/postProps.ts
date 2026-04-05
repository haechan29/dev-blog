import { formatDate } from '@/features/post/domain/lib/date';
import Post from '@/features/post/domain/model/post';
import { PostVisibility } from '@/features/post/domain/types/postVisibility';
import { toUserNickname } from '@/features/user/ui/userProps';
import { JSONContent } from '@tiptap/core';

export interface PostProps {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  contentJson: JSONContent;
  preview: string;
  userId: string;
  authorName: string;
  bio: string | null;
  profileImageUrl: string | null;
  seriesId: string | null;
  seriesOrder: number | null;
  seriesTitle: string | null;
  likeCount: number;
  viewCount: string | null;
  commentCount: number;
  visibility: PostVisibility;
}

export function createProps(post: Post): PostProps {
  return {
    id: post.id,
    title: post.title,
    createdAt: formatDate(post.createdAt),
    updatedAt: formatDate(post.updatedAt),
    tags: post.tags,
    contentJson: post.contentJson,
    preview: post.preview,
    userId: post.userId,
    authorName: toUserNickname({ id: post.userId, nickname: post.authorName }),
    bio: post.bio,
    profileImageUrl: post.profileImageUrl,
    seriesId: post.seriesId,
    seriesOrder: post.seriesOrder,
    seriesTitle: post.seriesTitle,
    likeCount: post.likeCount,
    viewCount: formatViewCount(post.viewCount),
    commentCount: post.commentCount,
    visibility: post.visibility,
  };
}

export function formatViewCount(viewCount: number): string | null {
  if (viewCount < 100) return null;
  if (viewCount < 1000) return `${Math.floor(viewCount / 100) * 100}+`;
  return `${(viewCount / 1000).toFixed(1).replace(/\.0$/, '')}K+`;
}
