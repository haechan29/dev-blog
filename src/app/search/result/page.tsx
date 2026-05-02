import { auth } from '@/auth';
import SearchResultPageClient from '@/components/search/searchResultPageClient';
import * as PostServerRepository from '@/features/post/data/repository/postServerRepository';
import { createProps } from '@/features/post/ui/postProps';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function SearchResultPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const session = await auth();
  const userId =
    session?.user?.id ?? (await cookies()).get('userId')?.value;

  const { q } = await searchParams;

  if (!q?.trim()) {
    redirect('/search');
  }

  const { posts, nextCursor } = await PostServerRepository.searchPosts({
    query: q,
  });
  const postProps = posts.map(createProps);

  return (
    <SearchResultPageClient
      isLoggedIn={!!session}
      query={q}
      initialPosts={postProps}
      initialCursor={nextCursor}
      userId={userId}
    />
  );
}
