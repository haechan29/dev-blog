'use server';

import { ValidationError } from '@/errors/errors';
import * as CreatorServerRepository from '@/features/creator/data/repository/creatorServerRepository';
import { revalidatePath } from 'next/cache';

export async function createCreator(formData: FormData) {
  const channelName = formData.get('channelName') as string;
  const email = formData.get('email') as string;
  const memo = formData.get('memo') as string | null;

  if (!channelName) {
    throw new ValidationError('채널명을 찾을 수 없습니다');
  }

  if (!email) {
    throw new ValidationError('이메일을 찾을 수 없습니다');
  }

  const creator = await CreatorServerRepository.createCreator({
    channelName,
    email,
    memo: memo || undefined,
  });

  revalidatePath('/admin/creators');

  return creator;
}

export async function updateCreator(id: string, formData: FormData) {
  const channelName = formData.get('channelName') as string;
  const email = formData.get('email') as string;
  const memo = formData.get('memo') as string | null;

  const creator = await CreatorServerRepository.updateCreator({
    id,
    ...(channelName && { channelName }),
    ...(email && { email }),
    ...(memo && { memo }),
  });

  revalidatePath('/admin/creators');

  return creator;
}

export async function deleteCreator(id: string) {
  await CreatorServerRepository.deleteCreator(id);

  revalidatePath('/admin/creators');
}
