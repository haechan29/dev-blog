import { OutreachEmailDto } from '@/features/outreach-email/data/dto/outreachEmailDto';
import { OutreachEmailEntity } from '@/features/outreach-email/data/entities/outreachEmailEntities';

export function toData(entity: OutreachEmailEntity): OutreachEmailDto {
  const direction = entity.direction === 'sent' ? 'sent' : 'received';

  return {
    id: entity.id,
    creatorId: entity.creatorId,
    direction,
    subject: entity.subject,
    body: entity.body,
    sentAt: entity.sentAt,
    isRead: entity.isRead,
  };
}
