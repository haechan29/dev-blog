import PostSidebarClient from '@/components/post/postSidebarClient';
import { fetchPosts } from '@/features/post/domain/service/postServerService';
import { createProps } from '@/features/post/ui/postProps';
import { fetchSeriesByUserId } from '@/features/series/domain/service/seriesServerService';

export default async function PostSidebar({
  userId,
  currentPostId,
}: {
  userId: string;
  currentPostId: string;
}) {
  const [authorPosts, authorSeries] = await Promise.all([
    fetchPosts(userId).then(posts => posts.map(createProps)),
    fetchSeriesByUserId(userId),
  ]);

  return (
    <PostSidebarClient
      currentPostId={currentPostId}
      posts={authorPosts}
      series={authorSeries}
    />
  );
}
