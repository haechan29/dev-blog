import { InquiryThreadDto } from '@/features/inquiry/data/dto/inquiryThreadDto';
import { InquiryThreadEntity } from '@/features/inquiry/data/entities/inquiryThreadEntities';
import {
  InquiryThreadStatus,
  isInquiryThreadStatus,
} from '@/features/inquiry/domain/types/inquiryThreadStatus';

function toStatus(value: string): InquiryThreadStatus {
  return isInquiryThreadStatus(value) ? value : 'AWAITING_REPLY';
}

export function toDto(entity: InquiryThreadEntity): InquiryThreadDto {
  return {
    id: entity.id,
    status: toStatus(entity.status),
    firstMessagePreview: entity.first_message_preview,
    firstMessageId: entity.first_message_id,
    lastMessagePreview: entity.last_message_preview,
    lastMessageId: entity.last_message_id,
    userUnreadCount: entity.user_unread_count,
    adminUnreadCount: entity.admin_unread_count,
    createdAt: entity.created_at,
    updatedAt: entity.updated_at,
  };
}
