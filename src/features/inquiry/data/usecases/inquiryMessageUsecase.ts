import {
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
  ValidationError,
} from '@/errors/errors';
import {
  INQUIRY_MAX_IMAGES,
  LAST_MESSAGE_PREVIEW_MAX,
} from '@/features/inquiry/constants/inquiry';
import * as InquiryMessageMapper from '@/features/inquiry/data/mapper/inquiryMessageMapper';
import * as InquiryMessageQueries from '@/features/inquiry/data/queries/inquiryMessageQueries';
import * as InquiryThreadQueries from '@/features/inquiry/data/queries/inquiryThreadQueries';
import * as MediaQueries from '@/features/media/data/queries/mediaQueries';
import 'server-only';

export async function createMyInquiryMessage({
  userId,
  threadId,
  content: contentRaw,
  images = [],
}: {
  userId: string;
  threadId: string;
  content: string;
  images?: string[];
}): Promise<{ messageId: string }> {
  if (!userId) {
    throw new UnauthorizedError('인증되지 않은 요청입니다');
  }

  const thread = await InquiryThreadQueries.fetchInquiryThreadForAuth(threadId);
  if (!thread || thread.is_deleted) {
    throw new NotFoundError('문의를 찾을 수 없습니다');
  }
  if (thread.user_id !== userId) {
    throw new ForbiddenError('이 문의에 접근할 수 없습니다');
  }

  const trimmedContent = contentRaw.trim();
  if (!trimmedContent && images.length === 0) {
    throw new ValidationError('내용을 입력해주세요');
  }

  if (images.length > INQUIRY_MAX_IMAGES) {
    throw new ValidationError('최대 이미지 개수를 초과했습니다');
  }

  const content = trimmedContent ? trimmedContent : `사진 ${images.length}장`;

  const messageId = await InquiryMessageQueries.createInquiryMessage({
    threadId,
    userId,
    content,
    images,
    lastMessagePreview: content.slice(0, LAST_MESSAGE_PREVIEW_MAX),
  });

  return { messageId };
}

export async function getMyInquiryMessagesByThreadId({
  userId,
  threadId,
}: {
  userId?: string;
  threadId: string;
}) {
  if (!userId) {
    throw new UnauthorizedError('인증되지 않은 요청입니다');
  }

  const thread = await InquiryThreadQueries.fetchInquiryThreadForAuth(threadId);
  if (!thread || thread.is_deleted) {
    throw new NotFoundError('문의를 찾을 수 없습니다');
  }
  if (thread.user_id !== userId) {
    throw new ForbiddenError('이 문의에 접근할 수 없습니다');
  }

  const messages =
    await InquiryMessageQueries.fetchInquiryMessagesByThreadId(threadId);

  const imageIds = [
    ...new Set(
      messages.filter(m => !m.is_deleted).flatMap(m => m.images ?? [])
    ),
  ];
  const urlById = await MediaQueries.fetchMediaUrlsByIds(imageIds);

  return {
    messages: messages.map(m => InquiryMessageMapper.toDto(m, urlById)),
  };
}
