import {
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
} from '@/errors/errors';
import * as InquiryMessageMapper from '@/features/inquiry/data/mapper/inquiryMessageMapper';
import * as InquiryMessageQueries from '@/features/inquiry/data/queries/inquiryMessageQueries';
import * as InquiryThreadQueries from '@/features/inquiry/data/queries/inquiryThreadQueries';
import * as MediaQueries from '@/features/media/data/queries/mediaQueries';
import 'server-only';

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
