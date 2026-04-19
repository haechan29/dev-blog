import { InquiryThreadDto } from '@/features/inquiry/data/dto/inquiryThreadDto';
import { InquiryThreadProps } from '@/features/inquiry/ui/model/inquiryThreadProps';

export function toDto(dto: InquiryThreadDto): InquiryThreadProps {
  return {
    id: dto.id,
    status: dto.status,
    firstLineText: dto.firstMessagePreview ?? '(문의 내용 없음)',
    secondLineText: dto.lastMessagePreview ?? '아직 답변이 없습니다.',
    firstMessageId: dto.firstMessageId,
    lastMessageId: dto.lastMessageId,
    userUnreadCount: dto.userUnreadCount,
    adminUnreadCount: dto.adminUnreadCount,
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
  };
}
