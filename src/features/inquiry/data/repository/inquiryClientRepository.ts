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

export async function createInquiry(
  content: string,
  images?: string[]
): Promise<{ threadId: string }> {
  const response = await api.post(`/api/inquiries`, {
    content,
    ...(images !== undefined && { images }),
  });
  return response.data;
}
