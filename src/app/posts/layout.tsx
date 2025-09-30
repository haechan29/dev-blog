import PostSidebar from '@/components/post/postSidebar';
import PostToolbar from '@/components/post/postToolbar';
import { fetchAllPosts } from '@/features/post/domain/service/postService';
import { createPostProps } from '@/features/post/ui/postProps';
import { ReactNode, Suspense } from 'react';

export default async function PostsLayout({
  children,
}: {
  children: ReactNode;
}) {
  const posts = await fetchAllPosts();
  const postProps = posts.map(createPostProps);

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
