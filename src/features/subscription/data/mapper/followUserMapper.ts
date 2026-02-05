import { FollowUserDto } from '@/features/subscription/data/dto/followUserDto';
import { FollowUserEntity } from '@/features/subscription/data/entities/followUserEntities';

export function toDto(entity: FollowUserEntity): FollowUserDto {
  return {
    id: entity.id,
    nickname: entity.nickname,
    profileImageUrl: entity.profile_image_url,
  };
}
