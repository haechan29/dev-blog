import type { InquiryMessageDto } from '@/features/inquiry/data/dto/inquiryMessageDto';
import type { InquiryThreadsPage } from '@/features/inquiry/data/dto/inquiryThreadDto';
import * as InquiryMessageUsecase from '@/features/inquiry/data/usecases/inquiryMessageUsecase';
import * as InquiryThreadUsecase from '@/features/inquiry/data/usecases/inquiryThreadUsecase';
import 'server-only';

export async function getMyInquiryThreads(params: {
  userId?: string;
  cursorUpdatedAt: string | null;
  cursorId: string | null;
}): Promise<InquiryThreadsPage> {
  return await InquiryThreadUsecase.getMyInquiryThreads(params);
}

export async function getMyInquiryMessagesByThreadId(params: {
  userId?: string;
  threadId: string;
}): Promise<{ messages: InquiryMessageDto[] }> {
  return await InquiryMessageUsecase.getMyInquiryMessagesByThreadId(params);
}
