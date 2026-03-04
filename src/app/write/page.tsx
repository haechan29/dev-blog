import { auth } from '@/auth';
import WritePageClient from '@/components/write/writePageClient';
import * as CreatorServerRepository from '@/features/creator/data/repository/creatorServerRepository';
import { getUserId } from '@/lib/user';
import { Suspense } from 'react';

export default async function WritePage() {
  const session = await auth();
  const userId = await getUserId();
  const isCreator = userId
    ? !!(await CreatorServerRepository.getCreatorByUserId(userId))
    : false;
  const skipPasswordInput = !!session || isCreator;

  return (
    <Suspense>
      <WritePageClient skipPasswordInput={skipPasswordInput} />
    </Suspense>
  );
}
