'use server';

import { ValidationError } from '@/errors/errors';
import * as OutreachEmailRepository from '@/features/outreach-email/data/repository/outreachEmailServerRepository';
import { revalidatePath } from 'next/cache';

export async function createOutreachEmail(
  creatorId: string,
  formData: FormData
) {
  const subject = formData.get('subject') as string;
  const body = formData.get('body') as string;

  if (!subject) {
    throw new ValidationError('제목을 찾을 수 없습니다');
  }

  if (!body) {
    throw new ValidationError('본문을 찾을 수 없습니다');
  }

  const email = await OutreachEmailRepository.createOutreachEmail({
    creatorId,
    subject,
    body,
  });

  revalidatePath('/admin/outreach-emails');

  return email;
}

export async function updateOutreachEmail(id: string, formData: FormData) {
  const subject = formData.get('subject') as string;
  const body = formData.get('body') as string;
  const status = formData.get('status') as string | null;
  const respondedAt = formData.get('respondedAt') as string | null;

  const email = await OutreachEmailRepository.updateOutreachEmail({
    id,
    ...(subject && { subject }),
    ...(body && { body }),
    ...(status && {
      status: status as 'sent' | 'responded',
    }),
    ...(respondedAt !== undefined && { respondedAt }),
  });

  revalidatePath('/admin/outreach-emails');

  return email;
}

export async function deleteOutreachEmail(id: string) {
  await OutreachEmailRepository.deleteOutreachEmail(id);

  revalidatePath('/admin/outreach-emails');
}
