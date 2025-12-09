import WritePageClient from '@/components/write/writePageClient';
import { getUserId } from '@/lib/user';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

export default async function WritePage() {
  const userId = await getUserId();

  if (!userId) {
    notFound();
  }

  return (
    <Suspense>
      <WritePageClient userId={userId} />
    </Suspense>
  );
}
