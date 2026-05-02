import { auth } from '@/auth';
import PostsPageClient from '@/components/series/postsPageClient';
import * as CreatorServerRepository from '@/features/creator/data/repository/creatorServerRepository';
import * as PostServerRepository from '@/features/post/data/repository/postServerRepository';
import { createProps } from '@/features/post/ui/postProps';
import { cookies } from 'next/headers';

export default async function PostsPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;

  const session = await auth();
  const currentUserId =
    session?.user?.id ?? (await cookies()).get('userId')?.value;

  const [posts, creator] = await Promise.all([
    PostServerRepository.getPostsByUserId(userId).then(posts =>
      posts.map(createProps)
    ),
    currentUserId
      ? CreatorServerRepository.getCreatorByUserId(currentUserId)
      : null,
  ]);

  return (
    <PostsPageClient
      userId={userId}
      currentUserId={currentUserId}
      isLoggedIn={!!session}
      isCreator={!!creator}
      initialPosts={posts}
    />
  );
}
