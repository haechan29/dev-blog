import { InquiryThreadsPage } from '@/features/inquiry/data/dto/inquiryThreadDto';
import * as InquiryThreadMapper from '@/features/inquiry/data/mapper/inquiryThreadMapper';
import * as InquiryThreadQueries from '@/features/inquiry/data/queries/inquiryThreadQueries';
import 'server-only';

const INQUIRY_THREAD_LIMIT = 5;

export async function getMyInquiryThreads({
  userId,
  cursorUpdatedAt,
  cursorId,
}: {
  userId?: string;
  cursorUpdatedAt: string | null;
  cursorId: string | null;
}): Promise<InquiryThreadsPage> {
  if (!userId) {
    return { threads: [], nextCursor: null };
  }

  const rows = await InquiryThreadQueries.fetchInquiryThreads({
    userId,
    limit: INQUIRY_THREAD_LIMIT + 1,
    cursorUpdatedAt: cursorUpdatedAt ?? undefined,
    cursorId: cursorId ?? undefined,
  });

  const isLastPage = rows.length <= INQUIRY_THREAD_LIMIT;
  const sliced = rows.slice(0, INQUIRY_THREAD_LIMIT);
  const last = sliced.at(-1);

  return {
    threads: sliced.map(InquiryThreadMapper.toDto),
    nextCursor:
      isLastPage || !last
        ? null
        : { updatedAt: last.updated_at, id: last.id },
  };
}
