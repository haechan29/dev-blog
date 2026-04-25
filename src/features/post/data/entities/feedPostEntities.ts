import { UserEntity } from '@/features/user/data/entities/userEntities';
import { PostVisibility } from '@/features/post/domain/types/postVisibility';

export interface FeedPostEntity {
  id: string;
  title: string;
  tags: string[];
  content_json: object;
  preview: string;
  created_at: string;
  updated_at: string | null;
  user_id: string;
  series_id: string | null;
  series_order: number | null;
  visibility: PostVisibility;
  users: Pick<
    UserEntity,
    'nickname' | 'deleted_at' | 'registered_at' | 'bio' | 'profile_image_url'
  >;
  series: { title: string } | null;
  post_stats: {
    like_count: number;
    view_count: number;
    comment_count: number;
    popularity: number;
  };
}
