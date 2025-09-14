import BlogSidebar from '@/components/blogSidebar';
import { ReactNode } from 'react';
import { fetchAllPosts } from '@/features/post/domain/service/postService';
import PostToolbar from '@/components/postToolbar';

export default async function PostsLayout({
  children,
}: {
  children: ReactNode;
}) {
  const posts = await fetchAllPosts();
  const postProps = posts.map(post => post.toProps());

  return (
    <div className='min-h-screen bg-white'>
      <BlogSidebar
        className='fixed left-0 top-0 h-screen hidden xl:flex w-1/5 max-w-72'
        posts={postProps}
      />
      <div className='flex'>
        <div className='hidden xl:flex flex-1 max-w-72' />
        <div className='flex-3'>
          <div className='flex flex-col'>
            <PostToolbar className='block xl:hidden mb-4' />
            {children}
          </div>
        </div>
        <div className='hidden xl:flex flex-1 max-w-72' />
      </div>
    </div>
  );
}
