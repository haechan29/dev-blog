import { UserEntity } from '@/features/user/data/entities/userEntities';

export interface SeriesEntity {
  id: string;
  title: string;
  description: string | null;
  user_id: string;
  created_at: string;
  updated_at: string;
  users?: Pick<UserEntity, 'nickname'> | null;
  posts?: { count: number }[];
}
