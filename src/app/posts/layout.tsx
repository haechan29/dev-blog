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
      <PostToolbar />
      <BlogSidebar posts={postProps} />
      <div className='xl:mx-72'>{children}</div>
    </div>
  );
}
