import {
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
  ValidationError,
} from '@/errors/errors';
import {
  INQUIRY_MAX_IMAGES,
  MESSAGE_PREVIEW_MAX,
} from '@/features/inquiry/constants/inquiry';
import { InquiryThreadsPage } from '@/features/inquiry/data/dto/inquiryThreadDto';
import * as InquiryThreadMapper from '@/features/inquiry/data/mapper/inquiryThreadMapper';
import * as InquiryThreadQueries from '@/features/inquiry/data/queries/inquiryThreadQueries';
import { InquiryThreadStatus } from '@/features/inquiry/domain/types/inquiryThreadStatus';
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

  const rows = await InquiryThreadQueries.fetchMyInquiryThreads({
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

export async function getInquiryThreads({
  cursorUpdatedAt,
  cursorId,
  status,
}: {
  cursorUpdatedAt: string | null;
  cursorId: string | null;
  status?: InquiryThreadStatus;
}): Promise<InquiryThreadsPage> {
  const rows = await InquiryThreadQueries.fetchInquiryThreads({
    limit: INQUIRY_THREAD_LIMIT + 1,
    cursorUpdatedAt: cursorUpdatedAt ?? undefined,
    cursorId: cursorId ?? undefined,
    status,
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
    messagePreview: content.slice(0, MESSAGE_PREVIEW_MAX),
  });

  return { threadId };
}

export async function deleteMyInquiryThread({
  userId,
  threadId,
}: {
  userId?: string;
  threadId: string;
}): Promise<void> {
  if (!userId) {
    throw new UnauthorizedError('인증되지 않은 요청입니다');
  }

  const row = await InquiryThreadQueries.fetchInquiryThreadForAuth(threadId);
  if (!row) {
    throw new NotFoundError('문의를 찾을 수 없습니다');
  }
  if (row.user_id !== userId) {
    throw new ForbiddenError('이 문의에 접근할 수 없습니다');
  }
  if (row.is_deleted) {
    return;
  }

  await InquiryThreadQueries.softDeleteInquiryThread({
    threadId,
    userId,
  });
}
