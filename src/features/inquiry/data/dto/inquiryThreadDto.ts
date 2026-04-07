import { InquiryThreadStatus } from '@/features/inquiry/domain/types/inquiryThreadStatus';
import { InquiryCursor } from '@/features/inquiry/domain/types/page';

export interface InquiryThreadDto {
  id: string;
  status: InquiryThreadStatus;
  firstMessagePreview: string | null;
  firstMessageId: string | null;
  lastMessagePreview: string | null;
  lastMessageId: string | null;
  userUnreadCount: number;
  adminUnreadCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface InquiryThreadsPage {
  threads: InquiryThreadDto[];
  nextCursor: InquiryCursor | null;
}
