import PostPreviewItem from '@/components/postPreviewItem';
import PostsDispatcher from '@/components/postsDispatcher';
import { fetchAllPosts } from '@/features/post/domain/service/postService';
import { PostItemProps } from '@/features/post/ui/postItemProps';
import { fetchPostStat } from '@/features/postStat/domain/service/postStatService';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';

export default async function PostPage({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string }>;
}) {
  const queryClient = new QueryClient();

  const tag = await searchParams.then(param => param.tag ?? null);
  const posts = await fetchAllPosts();
  const filteredPosts = tag
    ? posts.filter(post => post.tags?.includes(tag))
    : posts;
  const postProps = filteredPosts.map(post => post.toProps());

  const prefetchStat = (post: PostItemProps) =>
    queryClient.prefetchQuery({
      queryKey: ['posts', post.slug, 'stats'],
      queryFn: () => fetchPostStat(post.slug).then(stat => stat.toProps()),
    });

  await Promise.allSettled(postProps.map(prefetchStat));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PostsDispatcher tag={tag} />
      <div className='px-10 xl:px-20 py-8 flex flex-col'>
        {postProps.map(post => (
          <PostPreviewItem key={post.slug} tag={tag} post={post} />
        ))}
      </div>
    </HydrationBoundary>
  );
}
