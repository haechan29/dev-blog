'use server';

import { auth } from '@/auth';
import { UnauthorizedError } from '@/errors/errors';
import * as InquiryServerRepository from '@/features/inquiry/data/repository/inquiryServerRepository';
import { assertAdmin } from '@/lib/admin';

export async function createAdminInquiryMessageAction({
  threadId,
  content,
  images,
}: {
  threadId: string;
  content: string;
  images?: string[];
}) {
  await assertAdmin();

  const session = await auth();
  const adminId = session?.user?.user_id;
  if (!adminId) {
    throw new UnauthorizedError('인증되지 않은 요청입니다');
  }

  return await InquiryServerRepository.createAdminInquiryMessage({
    adminId,
    threadId,
    content,
    images,
  });
}
