import PostSidebarClient from '@/components/post/postSidebarClient';
import * as PostServerService from '@/features/post/domain/service/postServerService';
import { createProps } from '@/features/post/ui/postProps';
import * as SeriesServerService from '@/features/series/domain/service/seriesServerService';

export default async function PostSidebar({
  userId,
  currentPostId,
}: {
  userId: string;
  currentPostId: string;
}) {
  const [authorPosts, authorSeries] = await Promise.all([
    PostServerService.fetchPostsByUserId(userId).then(posts =>
      posts.map(createProps)
    ),
    SeriesServerService.fetchSeriesByUserId(userId),
  ]);

  return (
    <PostSidebarClient
      currentPostId={currentPostId}
      posts={authorPosts}
      series={authorSeries}
    />
  );
}
