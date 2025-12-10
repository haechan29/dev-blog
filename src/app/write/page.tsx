import { auth } from '@/auth';
import WritePageClient from '@/components/write/writePageClient';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

export default async function WritePage() {
  const session = await auth();
  const userId =
    session?.user?.user_id ?? (await cookies()).get('userId')?.value;

  if (!userId) {
    notFound();
  }

  return (
    <Suspense>
      <WritePageClient isLoggedIn={!!session} />
    </Suspense>
  );
}
