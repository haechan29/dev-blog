import { PostVisibility } from '@/features/post/domain/types/postVisibility';
import { UserEntity } from '@/features/user/data/entities/userEntities';

export interface SeriesEntity {
  id: string;
  title: string;
  description: string | null;
  user_id: string;
  created_at: string;
  updated_at: string;
  users: Pick<UserEntity, 'nickname' | 'profile_image_url'>;
  posts: {
    id: string;
    title: string;
    created_at: string;
    series_id: string | null;
    series_order: number | null;
    visibility: PostVisibility;
    post_stats: {
      like_count: number;
      view_count: number;
      comment_count: number;
    } | null;
  }[];
}
