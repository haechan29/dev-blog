import PostSidebar from '@/components/post/postSidebar';
import { fetchPosts } from '@/features/post/domain/service/postService';
import { createProps } from '@/features/post/ui/postProps';
import { ReactNode } from 'react';

export default async function PostsLayout({
  children,
}: {
  children: ReactNode;
}) {
  const posts = await fetchPosts().then(posts => posts.map(createProps));

  return (
    <>
      <PostSidebar posts={posts} />
      {children}
    </>
  );
}
