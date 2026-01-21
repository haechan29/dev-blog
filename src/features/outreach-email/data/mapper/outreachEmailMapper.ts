import { OutreachEmailEntity } from '@/features/outreach-email/data/entities/outreachEmailEntities';
import { OutreachEmail } from '@/features/outreach-email/domain/model/outreachEmail';

export function toDomain(entity: OutreachEmailEntity): OutreachEmail {
  return {
    id: entity.id,
    creatorId: entity.creator_id,
    channelName: entity.creators?.channel_name,
    subject: entity.subject,
    body: entity.body,
    status: entity.status,
    sentAt: entity.sent_at,
    respondedAt: entity.responded_at,
    createdAt: entity.created_at,
    updatedAt: entity.updated_at,
  };
}
