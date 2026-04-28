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
    firstMessagePreview: entity.firstMessagePreview,
    firstMessageId: entity.firstMessageId,
    lastMessagePreview: entity.lastMessagePreview,
    lastMessageId: entity.lastMessageId,
    userUnreadCount: entity.userUnreadCount,
    adminUnreadCount: entity.adminUnreadCount,
    createdAt: entity.createdAt,
    updatedAt: entity.updatedAt,
  };
}
