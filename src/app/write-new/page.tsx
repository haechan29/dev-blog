import { auth } from '@/auth';
import NewWritePageClient from '@/components/write/newWritePageClient';
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
      <NewWritePageClient skipPasswordInput={skipPasswordInput} />
    </Suspense>
  );
}
