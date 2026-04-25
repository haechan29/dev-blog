import { PostVisibility } from '@/features/post/domain/types/postVisibility';

export interface PostDto {
  id: string;
  title: string;
  tags: string[];
  contentJson: object;
  preview: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  seriesId: string | null;
  seriesOrder: number | null;
  visibility: PostVisibility;
  user: {
    nickname: string | null;
    bio: string | null;
    profileImageUrl: string | null;
    deletedAt: string | null;
    registeredAt: string | null;
  };
  series: {
    title: string;
  } | null;
  postStat: {
    likeCount: number;
    viewCount: number;
    commentCount: number;
  };
}
