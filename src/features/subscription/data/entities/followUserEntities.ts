import { UserEntity } from '@/features/user/data/entities/userEntities';

export type FollowUserEntity = Pick<
  UserEntity,
  'id' | 'nickname' | 'profile_image_url'
>;
