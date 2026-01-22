import { CreatorEntity } from '@/features/creator/data/entities/creatorEntities';
import { Creator } from '@/features/creator/domain/model/creator';

export function toDomain(entity: CreatorEntity): Creator {
  return {
    id: entity.id,
    channelName: entity.channel_name,
    email: entity.email,
    memo: entity.memo,
    status: entity.status,
    createdAt: entity.created_at,
  };
}
