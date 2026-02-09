import { auth } from '@/auth';
import HomePageClient from '@/components/home/homePageClient';
import * as PostServerService from '@/features/post/domain/service/postServerService';
import { createProps } from '@/features/post/ui/postProps';
import { cookies } from 'next/headers';

export default async function HomePage() {
  console.time('auth');
  const session = await auth();
  console.timeEnd('auth');
  const userId =
    session?.user?.user_id ?? (await cookies()).get('userId')?.value;

  console.time('getFeedPosts');
  const { posts, nextCursor } = await PostServerService.getFeedPosts(
    null,
    userId
  );
  console.timeEnd('getFeedPosts');
  const postProps = posts.map(createProps);

  console.time('render');
  const result = (
    <HomePageClient
      isLoggedIn={!!session}
      initialPosts={postProps}
      initialCursor={nextCursor}
      userId={userId}
    />
  );
  console.timeEnd('render');

  return result;
}
