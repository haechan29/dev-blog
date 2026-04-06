import { InquiryThreadStatus } from '@/features/inquiry/domain/types/inquiryThreadStatus';
import { InquiryCursor } from '@/features/inquiry/domain/types/page';

export interface InquiryThreadDto {
  id: string;
  status: InquiryThreadStatus;
  lastMessagePreview: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface InquiryThreadsPage {
  threads: InquiryThreadDto[];
  nextCursor: InquiryCursor | null;
}
