import { auth } from '@/auth';
import WritePageClient from '@/components/write/writePageClient';
import * as CreatorQueries from '@/features/creator/data/queries/creatorQueries';
import { getUserId } from '@/lib/user';
import { Suspense } from 'react';

export default async function WritePage() {
  const session = await auth();
  const userId = await getUserId();
  const isCreator = userId
    ? !!(await CreatorQueries.fetchCreatorByUserId(userId))
    : false;
  const skipPasswordInput = !!session || isCreator;

  return (
    <Suspense>
      <WritePageClient skipPasswordInput={skipPasswordInput} />
    </Suspense>
  );
}
