import { UserEntity } from '@/features/user/data/entities/userEntities';

export interface CommentEntity {
  id: number;
  post_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  like_count: number;
  user_id: string;
  users: Pick<UserEntity, 'nickname' | 'deleted_at'>;
  password_hash?: string | null;
}
