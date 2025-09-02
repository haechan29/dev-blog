import PostPreviewItem from '@/components/postPreviewItem';
import { fetchAllPosts } from '@/features/post/domain/service/postService';

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string }>;
}) {
  const tag = await searchParams.then(param => param.tag ?? null);
  const posts = await fetchAllPosts();
  const filteredPosts = tag
    ? posts.filter(post => post.tags?.includes(tag))
    : posts;
  const postProps = filteredPosts.map(post => post.toProps());

  return (
    <div className='py-8 flex flex-col'>
      {postProps.map(post => (
        <PostPreviewItem key={post.slug} post={post} />
      ))}
    </div>
  );
}
