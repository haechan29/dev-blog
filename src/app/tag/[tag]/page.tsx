import { auth } from '@/auth';
import HomePageClient from '@/components/home/homePageClient';
import * as PostServerRepository from '@/features/post/data/repository/postServerRepository';
import { createProps } from '@/features/post/ui/postProps';
import { cookies } from 'next/headers';

export default async function TagPage({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const session = await auth();
  const userId =
    session?.user?.user_id ?? (await cookies()).get('userId')?.value;

  const { tag: encodedTag } = await params;
  const tag = decodeURIComponent(encodedTag);

  const { posts, nextCursor } = await PostServerRepository.getFeedPosts({
    cursor: null,
    userId,
    tag,
  });
  const postProps = posts.map(createProps);

  return (
    <HomePageClient
      initialPosts={postProps}
      initialCursor={nextCursor}
      userId={userId}
      tag={tag}
    />
  );
}
