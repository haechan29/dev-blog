import PostPreview from '@/components/post/postPreview';
import PostsToolbar from '@/components/post/postsToolbar';
import { fetchPosts } from '@/features/post/domain/service/postService';
import { createProps, PostProps } from '@/features/post/ui/postProps';
import clsx from 'clsx';

export default async function PostsPage({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string }>;
}) {
  const tag = await searchParams.then(param => param.tag ?? null);
  const posts = await getPosts(tag);

  return (
    <>
      <PostsToolbar />
      <div
        className={clsx(
          'px-10 xl:px-20',
          'xl:ml-[var(--sidebar-width)]',
          'xl:mr-[calc(var(--toc-width)+var(--toc-margin))]'
        )}
      >
        <PostPreviews posts={posts} tag={tag} />
      </div>
    </>
  );
}

function PostPreviews({
  posts,
  tag,
}: {
  posts: PostProps[];
  tag: string | null;
}) {
  return (
    <div className='flex flex-col'>
      {posts.map(post => (
        <PostPreview key={post.id} tag={tag} post={post} />
      ))}
    </div>
  );
}

async function getPosts(tag: string | null): Promise<PostProps[]> {
  let posts = await fetchPosts();
  if (tag !== null) {
    posts = posts.filter(post => post.tags.includes(tag));
  }
  return posts.map(createProps);
}
