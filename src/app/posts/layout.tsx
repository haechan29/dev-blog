import BlogSidebar from '@/components/blogSidebar';
import { ReactNode } from 'react';
import { fetchAllPosts } from '@/features/post/domain/service/postService';

export default async function PostsLayout({ children }: { children: ReactNode; }) {
  const posts = await fetchAllPosts();
  const postProps = posts.map(post => post.toProps());

  return (<>
    <div className='min-h-screen bg-white'>
      <BlogSidebar className='fixed left-0 top-0 h-screen hidden xl:flex w-1/5 max-w-72' posts={postProps}/>
      <div className='max-w-2xl mx-auto px-4 py-8'>
        {children}
      </div>
    </div>
  </>)
}