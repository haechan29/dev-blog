import { UserEntity } from '@/features/user/data/entities/userEntities';

export interface CommentEntity {
  id: number;
  post_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  like_count: number;
  user_id: string | null;
  guest_id: string | null;
  users?: Pick<UserEntity, 'nickname' | 'deleted_at'> | null;
  password_hash?: string | null;
}
