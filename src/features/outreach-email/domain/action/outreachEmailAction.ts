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

export async function markOutreachEmailAsRead(id: string) {
  await assertAdmin();

  if (!id) {
    throw new ValidationError('이메일 ID가 필요합니다');
  }

  await OutreachEmailServerRepository.markAsRead(id);
  revalidatePath('/admin/creators');
}

export async function syncOutreachEmails() {
  await assertAdmin();

  const result = await OutreachEmailServerRepository.syncEmails();

  revalidatePath('/admin/creators');

  return result;
}
