import { UserResponseDto } from '@/features/user/data/dto/userResponseDto';
import { User } from '@/features/user/domain/types/user';

export function toData(user: User): UserResponseDto {
  return {
    id: user.id,
    nickname: user.nickname,
    createdAt: user.created_at,
  };
}
