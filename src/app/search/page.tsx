import { auth } from '@/auth';
import SearchPageClient from '@/components/search/searchPageClient';
import { cookies } from 'next/headers';

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const session = await auth();
  const userId =
    session?.user?.user_id ?? (await cookies()).get('userId')?.value;

  const { q } = await searchParams;

  return (
    <SearchPageClient isLoggedIn={!!session} initialQuery={q} userId={userId} />
  );
}
