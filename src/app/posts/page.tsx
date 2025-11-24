export const dynamic = 'force-dynamic';

import PostPreview from '@/components/post/postPreview';
import { EMPTY_TAG_NAME } from '@/features/post/constants/tagName';
import { fetchPosts } from '@/features/post/domain/service/postService';
import { createProps, PostProps } from '@/features/post/ui/postProps';

export default async function PostsPage({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string }>;
}) {
  const tag = await searchParams.then(param => param.tag ?? null);
  const posts = await getPosts(tag);

  return (
    <div className='flex flex-col mt-8 mb-20'>
      {posts.map((post, index) => (
        <div key={post.id} className='mb-8'>
          <PostPreview tag={tag} post={post} />
          {index !== posts.length - 1 && <div className='h-px bg-gray-200' />}
        </div>
      ))}
    </div>
  );
}

async function getPosts(tag: string | null): Promise<PostProps[]> {
  let posts = await fetchPosts();
  if (tag !== null) {
    posts = posts.filter(post => {
      return post.tags.length > 0
        ? post.tags.includes(tag)
        : tag === EMPTY_TAG_NAME;
    });
  }
  return posts.map(createProps);
}
