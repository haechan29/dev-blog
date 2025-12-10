import { auth } from '@/auth';
import WritePageClient from '@/components/write/writePageClient';
import { Suspense } from 'react';

export default async function WritePage() {
  const session = await auth();

  return (
    <Suspense>
      <WritePageClient isLoggedIn={!!session} />
    </Suspense>
  );
}
