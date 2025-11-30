import { UserResponseDto } from '@/features/user/data/dto/userResponseDto';
import { User } from '@/features/user/domain/model/user';

export function toDomain(dto: UserResponseDto): User {
  return { id: dto.id, nickname: dto.nickname, createdAt: dto.createdAt };
}
