import PostPreview from '@/components/post/postPreview';
import PostsPageClient from '@/components/post/postsPageClient';
import { fetchAllPosts } from '@/features/post/domain/service/postService';
import { createProps, PostProps } from '@/features/post/ui/postProps';
import { fetchPostStat } from '@/features/postStat/domain/service/postStatService';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';

export default async function PostsPage({
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
  const postProps = filteredPosts.map(createProps);

  const prefetchStat = (post: PostProps) =>
    queryClient.prefetchQuery({
      queryKey: ['posts', post.slug, 'stats'],
      queryFn: () => fetchPostStat(post.slug).then(stat => stat.toProps()),
    });

  await Promise.allSettled(postProps.map(prefetchStat));

  return (
    <>
      <PostsPageClient />

      <HydrationBoundary state={dehydrate(queryClient)}>
        <div className='px-10 xl:px-20 py-8 flex flex-col'>
          {postProps.map(post => (
            <PostPreview key={post.slug} tag={tag} post={post} />
          ))}
        </div>
      </HydrationBoundary>
    </>
  );
}
