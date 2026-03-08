import { PostVisibility } from '@/features/post/domain/types/postVisibility';
import { UserEntity } from '@/features/user/data/entities/userEntities';

export interface PostEntity {
  id: string;
  title: string;
  tags: string[];
  content: string;
  content_json: object | null;
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
  post_stats: { like_count: number; view_count: number } | null;
  password_hash?: string | null;
}

export interface PostEntityFlat {
  id: string;
  title: string;
  tags: string[];
  content: string;
  content_json: object | null;
  created_at: string;
  updated_at: string | null;
  user_id: string;
  series_id: string | null;
  series_order: number | null;
  visibility: PostVisibility;
  nickname: UserEntity['nickname'];
  deleted_at: UserEntity['deleted_at'];
  registered_at: UserEntity['registered_at'];
  bio: UserEntity['bio'];
  profile_image_url: UserEntity['profile_image_url'];
  series_title: string | null;
  like_count: number | null;
  view_count: number | null;
  relevance_score: number;
}
