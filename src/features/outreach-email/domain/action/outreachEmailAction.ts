'use server';

import { ValidationError } from '@/errors/errors';
import * as OutreachEmailServerRepository from '@/features/outreach-email/data/repository/outreachEmailServerRepository';
import { assertAdmin } from '@/lib/admin';
import { revalidatePath } from 'next/cache';

export async function sendOutreachEmail({
  creatorId,
  subject,
  body,
  replyToEmailId,
}: {
  creatorId: string;
  subject: string;
  body: string;
  replyToEmailId?: string;
}) {
  await assertAdmin();

  if (!creatorId) {
    throw new ValidationError('크리에이터 ID가 필요합니다');
  }

  if (!subject) {
    throw new ValidationError('제목이 필요합니다');
  }

  if (!body) {
    throw new ValidationError('본문이 필요합니다');
  }

  await OutreachEmailServerRepository.sendEmail({
    creatorId,
    subject,
    body,
    replyToEmailId,
  });

  revalidatePath('/admin/creators');
}
