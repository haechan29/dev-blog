import { CreatorEntity } from '@/features/creator/data/entities/creatorEntities';
import { Creator } from '@/features/creator/domain/model/creator';
import { toCreatorStatus } from '@/features/creator/domain/type/creatorStatus';

export function toDomain(entity: CreatorEntity): Creator {
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
