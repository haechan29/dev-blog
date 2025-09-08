import BlogSidebar from '@/components/blogSidebar';
import { ReactNode, Suspense } from 'react';
import { fetchAllPosts } from '@/features/post/domain/service/postService';

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
        <BlogSidebar
          className='fixed left-0 top-0 h-screen hidden xl:flex w-1/5 max-w-72'
          posts={postProps}
        />
      </Suspense>
      <div className='mx-auto xl:mx-72 px-20'>{children}</div>
    </div>
  );
}
