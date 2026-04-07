import { InquiryMessageSenderType } from '@/features/inquiry/domain/types/inquiryMessageSenderType';

export interface InquiryMessageDto {
  id: string;
  senderType: InquiryMessageSenderType;
  createdAt: string;
  content: string;
  imageUrls: string[];
}
