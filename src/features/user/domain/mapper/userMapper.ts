import { UserResponseDto } from '@/features/user/data/dto/userResponseDto';
import { User, UserStatus } from '@/features/user/domain/model/user';

export function getUserStatus(dto: UserResponseDto): UserStatus {
  if (dto.deletedAt) return 'DELETED';
  if (dto.registeredAt) return 'ACTIVE';
  return 'GUEST';
}

export function toDomain(dto: UserResponseDto): User {
  return {
    id: dto.id,
    nickname: dto.nickname,
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
    deletedAt: dto.deletedAt,
    userStatus: getUserStatus(dto),
  };
}
