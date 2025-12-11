import { UserResponseDto } from '@/features/user/data/dto/userResponseDto';
import { UserEntity } from '@/features/user/data/entities/userEntities';

export function toDto(user: UserEntity): UserResponseDto {
  return {
    id: user.id,
    nickname: user.nickname,
    createdAt: user.created_at,
    updatedAt: user.updated_at,
    deletedAt: user.deleted_at,
    registeredAt: user.registered_at,
  };
}
