import { InquiryThreadStatus } from '@/features/inquiry/domain/types/inquiryThreadStatus';

export interface InquiryThreadProps {
  id: string;
  status: InquiryThreadStatus;
  firstLineText: string;
  secondLineText: string;
  firstMessageId: string | null;
  lastMessageId: string | null;
  userUnreadCount: number;
  adminUnreadCount: number;
  createdAt: string;
  updatedAt: string;
}
