import { PostDto } from '@/features/post/data/dto/postDto';
import { formatDate } from '@/features/post/domain/lib/date';
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

export function createProps(post: PostDto): PostProps {
  return {
    id: post.id,
    title: post.title,
    createdAt: formatDate(post.createdAt),
    updatedAt: formatDate(post.updatedAt),
    tags: post.tags,
    contentJson: post.contentJson,
    preview: post.preview,
    userId: post.userId,
    visibility: post.visibility,
    authorName: toUserNickname({
      id: post.userId,
      nickname: post.user.nickname,
    }),
    bio: post.user.bio,
    profileImageUrl: post.user.profileImageUrl,
    seriesId: post.seriesId,
    seriesOrder: post.seriesOrder,
    seriesTitle: post.series?.title ?? null,
    likeCount: post.postStat.likeCount,
    viewCount: formatViewCount(post.postStat.viewCount),
    commentCount: post.postStat.commentCount,
  };
}

export function formatViewCount(viewCount: number): string | null {
  if (viewCount < 100) return null;
  if (viewCount < 1000) return `${Math.floor(viewCount / 100) * 100}+`;
  return `${(viewCount / 1000).toFixed(1).replace(/\.0$/, '')}K+`;
}
