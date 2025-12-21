import { auth } from '@/auth';
import HomePageClient from '@/components/home/homePageClient';
import * as PostServerService from '@/features/post/domain/service/postServerService';
import { createProps } from '@/features/post/ui/postProps';
import { cookies } from 'next/headers';

export default async function HomePage() {
  const session = await auth();
  const userId =
    session?.user?.user_id ?? (await cookies()).get('userId')?.value;

  const { posts, nextCursor } = await PostServerService.getFeedPosts(
    null,
    userId
  );
  const postProps = posts.map(createProps);

  return (
    <HomePageClient
      isLoggedIn={!!session}
      initialPosts={postProps}
      initialCursor={nextCursor}
      userId={userId}
    />
  );
}
