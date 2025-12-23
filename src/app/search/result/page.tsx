import { auth } from '@/auth';
import SearchResultPageClient from '@/components/search/searchResultPageClient';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function SearchResultPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const session = await auth();
  const userId =
    session?.user?.user_id ?? (await cookies()).get('userId')?.value;

  const { q } = await searchParams;

  if (!q?.trim()) {
    redirect('/search');
  }

  return (
    <SearchResultPageClient isLoggedIn={!!session} query={q} userId={userId} />
  );
}
