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
  users: Pick<UserEntity, 'nickname' | 'deleted_at'>;
  series: { title: string } | null;
  password_hash?: string | null;
}
