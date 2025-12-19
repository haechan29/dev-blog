import { UserEntity } from '@/features/user/data/entities/userEntities';

export interface CommentEntity {
  id: number;
  post_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  like_count: number;
  user_id: string;
  users: Pick<UserEntity, 'nickname' | 'deleted_at' | 'registered_at'>;
  password_hash?: string | null;
}

export interface CommentEntityFlat {
  id: number;
  post_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  like_count: number;
  user_id: string;
  nickname: UserEntity['nickname'];
  deleted_at: UserEntity['deleted_at'];
  registered_at: UserEntity['registered_at'];
  password_hash?: string | null;
}
