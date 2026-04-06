import { ValidationError } from '@/errors/errors';
import { InquiryThreadsPage } from '@/features/inquiry/data/dto/inquiryThreadDto';
import * as InquiryThreadMapper from '@/features/inquiry/data/mapper/inquiryThreadMapper';
import * as InquiryThreadQueries from '@/features/inquiry/data/queries/inquiryThreadQueries';
import 'server-only';

const INQUIRY_THREAD_LIMIT = 5;
const INQUIRY_MAX_IMAGES = 5;
const LAST_MESSAGE_PREVIEW_MAX = 120;

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
      isLastPage || !last ? null : { updatedAt: last.updated_at, id: last.id },
  };
}

export async function createMyInquiryThread({
  userId,
  content: contentRaw,
  images = [],
}: {
  userId: string;
  content: string;
  images?: string[];
}): Promise<{ threadId: string }> {
  const trimmedContent = contentRaw.trim();
  if (!trimmedContent && images.length === 0) {
    throw new ValidationError('내용을 입력해주세요');
  }

  if (images.length > INQUIRY_MAX_IMAGES) {
    throw new ValidationError('최대 이미지 개수를 초과했습니다');
  }

  const content = trimmedContent ? trimmedContent : `사진 ${images.length}장`;

  const threadId = await InquiryThreadQueries.createInquiryThread({
    userId,
    content,
    images,
    lastMessagePreview: content.slice(0, LAST_MESSAGE_PREVIEW_MAX),
  });

  return { threadId };
}
