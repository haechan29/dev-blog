import { formatDate } from '@/features/post/domain/lib/date';
import { toUserNickname } from '@/features/user/ui/userProps';
import { extractPlainText } from '@/features/post/domain/lib/parse';
import Heading from '@/features/post/domain/model/heading';
import Post from '@/features/post/domain/model/post';
import { PostVisibility } from '@/features/post/domain/types/postVisibility';

export interface PostProps {
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
  bio: string | null;
  profileImageUrl: string | null;
  seriesId: string | null;
  seriesOrder: number | null;
  seriesTitle: string | null;
  likeCount: number;
  viewCount: number;
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
    viewCount: post.viewCount,
    visibility: post.visibility,
  };
}
