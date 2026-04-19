import { InquiryMessageSenderType } from '@/features/inquiry/domain/types/inquiryMessageSenderType';

export interface InquiryMessageProps {
  id: string;
  senderType: InquiryMessageSenderType;
  createdAt: string;
  isDeleted: boolean;
  content: string;
  imageUrls: string[];
  showDate: boolean;
  dateLabel: string;
  showTime: boolean;
  timeLabel: string;
  showSenderLabel: boolean;
}
