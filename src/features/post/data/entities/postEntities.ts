import { UserEntity } from '@/features/user/data/entities/userEntities';

export interface PostEntity {
  id: string;
  title: string;
  tags: string[];
  content: string;
  created_at: string;
  updated_at: string | null;
  user_id: string;
  series_id: string | null;
  series_order: number | null;
  users: Pick<UserEntity, 'nickname' | 'deleted_at' | 'registered_at'>;
  series: { title: string } | null;
  post_stats: { like_count: number; view_count: number } | null;
  password_hash?: string | null;
}

export interface PostEntityFlat {
  id: string;
  title: string;
  tags: string[];
  content: string;
  created_at: string;
  updated_at: string | null;
  user_id: string;
  series_id: string | null;
  series_order: number | null;
  nickname: UserEntity['nickname'];
  deleted_at: UserEntity['deleted_at'];
  registered_at: UserEntity['registered_at'];
  series_title: string | null;
  like_count: number | null;
  view_count: number | null;
  relevance_score: number;
}
