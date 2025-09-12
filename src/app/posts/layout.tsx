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
    <div className='min-h-screen flex bg-white'>
      <BlogSidebar
        className='hidden xl:flex flex-1 max-w-72 h-screen overflow-y-hidden'
        posts={postProps}
      />
      <div className='flex-3 h-screen overflow-y-auto scrollbar-hide'>
        {children}
      </div>
      <div className='hidden xl:flex flex-1 max-w-72' />
    </div>
  );
}
