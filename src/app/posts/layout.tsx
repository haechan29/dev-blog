import PostSidebar from '@/components/postSidebar';
import PostToolbar from '@/components/postToolbar';
import { fetchAllPosts } from '@/features/post/domain/service/postService';
import { ReactNode, Suspense } from 'react';

export default async function PostsLayout({
  children,
}: {
  children: ReactNode;
}) {
  const posts = await fetchAllPosts();
  const postProps = posts.map(post => post.toProps());

  return (
    <div className='min-h-screen bg-white'>
      <Suspense>
        <PostToolbar />
      </Suspense>
      <PostSidebar posts={postProps} />
      <div className='xl:mx-72'>{children}</div>
    </div>
  );
}
