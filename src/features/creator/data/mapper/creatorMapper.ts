import { CreatorDto } from '@/features/creator/data/dto/creatorDto';
import { CreatorEntity } from '@/features/creator/data/entities/creatorEntities';
import { toCreatorStatus } from '@/features/creator/domain/type/creatorStatus';

export function toDto(entity: CreatorEntity): CreatorDto {
  return {
    id: entity.id,
    channelName: entity.channelName,
    email: entity.email,
    memo: entity.memo,
    status: toCreatorStatus(entity.status),
    createdAt: entity.createdAt,
    userId: entity.userId,
  };
}
