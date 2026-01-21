import { OutreachEmailEntity } from '@/features/outreach-email/data/entities/outreachEmailEntities';
import { OutreachEmail } from '@/features/outreach-email/domain/model/outreachEmail';

export function toDomain(entity: OutreachEmailEntity): OutreachEmail {
  return {
    id: entity.id,
    creatorId: entity.creator_id,
    channelName: entity.creators?.channel_name,
    gmailThreadId: entity.gmail_thread_id,
    gmailMessageId: entity.gmail_message_id,
    direction: entity.direction,
    subject: entity.subject,
    body: entity.body,
    sentAt: entity.sent_at,
  };
}
