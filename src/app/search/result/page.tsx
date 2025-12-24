import { auth } from '@/auth';
import SearchResultPageClient from '@/components/search/searchResultPageClient';
import * as PostServerService from '@/features/post/domain/service/postServerService';
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
    session?.user?.user_id ?? (await cookies()).get('userId')?.value;

  const { q } = await searchParams;

  if (!q?.trim()) {
    redirect('/search');
  }

  const { posts, nextCursor } = await PostServerService.searchPosts(q, 20);
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
