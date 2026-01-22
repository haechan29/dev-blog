'use server';

import { ValidationError } from '@/errors/errors';
import { CreatorStatus } from '@/features/creator/data/entities/creatorEntities';
import * as CreatorServerRepository from '@/features/creator/data/repository/creatorServerRepository';
import { assertAdmin } from '@/lib/admin';
import { revalidatePath } from 'next/cache';

export async function createCreator({
  channelName,
  email,
  memo,
}: {
  channelName: string;
  email: string;
  memo?: string;
}) {
  await assertAdmin();

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

export async function updateCreator({
  id,
  channelName,
  email,
  memo,
  status,
}: {
  id: string;
  channelName?: string;
  email?: string;
  memo?: string;
  status?: CreatorStatus;
}) {
  await assertAdmin();

  const creator = await CreatorServerRepository.updateCreator({
    id,
    ...(channelName && { channelName }),
    ...(email && { email }),
    ...(memo && { memo }),
    ...(status && { status }),
  });

  revalidatePath('/admin/creators');

  return creator;
}

export async function deleteCreator(id: string) {
  await assertAdmin();

  await CreatorServerRepository.deleteCreator(id);

  revalidatePath('/admin/creators');
}
