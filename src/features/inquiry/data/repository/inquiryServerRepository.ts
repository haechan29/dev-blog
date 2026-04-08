import type { InquiryThreadsPage } from '@/features/inquiry/data/dto/inquiryThreadDto';
import * as InquiryThreadUsecase from '@/features/inquiry/data/usecases/inquiryThreadUsecase';
import 'server-only';

export async function getMyInquiryThreads(params: {
  userId?: string;
  cursorUpdatedAt: string | null;
  cursorId: string | null;
}): Promise<InquiryThreadsPage> {
  return await InquiryThreadUsecase.getMyInquiryThreads(params);
}

