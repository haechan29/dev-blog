import PostSidebar from '@/components/post/postSidebar';
import PostToolbar from '@/components/post/postToolbar';
import { fetchPosts } from '@/features/post/domain/service/postService';
import { createProps } from '@/features/post/ui/postProps';
import { ReactNode, Suspense } from 'react';

export default async function PostsLayout({
  children,
}: {
  children: ReactNode;
}) {
  const posts = await fetchPosts();
  const postProps = posts.map(createProps);

  return (
    <div className='min-h-screen bg-white'>
      <PostToolbar />
      <Suspense>
        <PostSidebar posts={postProps} />
      </Suspense>
      <div className='xl:mx-72'>{children}</div>
    </div>
  );
}
