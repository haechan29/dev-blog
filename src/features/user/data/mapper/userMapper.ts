import { UserResponseDto } from '@/features/user/data/dto/userResponseDto';
import { UserEntity } from '@/features/user/data/entities/userEntities';

export function toDto(user: UserEntity): UserResponseDto {
  return {
    id: user.id,
    nickname: user.nickname,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    deletedAt: user.deletedAt,
    registeredAt: user.registeredAt,
    profileImageUrl: user.profileImageUrl,
    bio: user.bio,
    subscriberCount: user.subscriberCount,
  };
}
