import type { InquiryMessageDto } from '@/features/inquiry/data/dto/inquiryMessageDto';
import type { InquiryThreadsPage } from '@/features/inquiry/data/dto/inquiryThreadDto';
import type { InquiryCursor } from '@/features/inquiry/domain/types/page';
import { api } from '@/lib/api';

export async function getMyInquiryThreads({
  cursor,
}: {
  cursor: InquiryCursor | null;
}): Promise<InquiryThreadsPage> {
  const searchParams = new URLSearchParams({
    ...(!!cursor && {
      cursorUpdatedAt: cursor.updatedAt,
      cursorId: cursor.id,
    }),
  });

  const qs = searchParams.toString();
  const response = await api.get(
    qs ? `/api/inquiries?${qs}` : '/api/inquiries'
  );
  return response.data;
}

export async function createInquiryThread(
  content: string,
  images?: string[]
): Promise<{ threadId: string }> {
  const response = await api.post(`/api/inquiries`, {
    content,
    images,
  });
  return response.data;
}

export async function createInquiryMessage(
  threadId: string,
  content: string,
  images?: string[]
): Promise<{ messageId: string }> {
  const response = await api.post(`/api/inquiries/${threadId}/messages`, {
    content,
    images,
  });
  return response.data;
}

export async function getMyInquiryMessagesByThreadId(
  threadId: string
): Promise<{ messages: InquiryMessageDto[] }> {
  const response = await api.get(`/api/inquiries/${threadId}/messages`);
  return response.data;
}
