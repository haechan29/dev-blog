import { PostVisibility } from '@/features/post/domain/types/postVisibility';

export interface PostDto {
  id: string;
  title: string;
  tags: string[];
  content: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  authorName: string;
  bio: string | null;
  profileImageUrl: string | null;
  deletedAt: string | null;
  registeredAt: string | null;
  seriesId: string | null;
  seriesOrder: number | null;
  seriesTitle: string | null;
  likeCount: number;
  viewCount: number;
  visibility: PostVisibility;
}
