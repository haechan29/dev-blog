import { auth } from '@/auth';
import WritePageClient from '@/components/write/writePageClient';
import { Suspense } from 'react';

export default async function WritePage() {
  const session = await auth();
  const userId = session?.user?.id ?? null;

  return (
    <Suspense>
      <WritePageClient userId={userId} />
    </Suspense>
  );
}
