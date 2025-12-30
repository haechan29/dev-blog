import { auth } from '@/auth';
import PostsPageClient from '@/components/series/postsPageClient';
import * as PostServerService from '@/features/post/domain/service/postServerService';
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
    session?.user?.user_id ?? (await cookies()).get('userId')?.value;

  const posts = await PostServerService.getPostsByUserId(userId).then(posts =>
    posts.map(createProps)
  );

  return (
    <PostsPageClient
      userId={userId}
      currentUserId={currentUserId}
      isLoggedIn={!!session}
      initialPosts={posts}
    />
  );
}
