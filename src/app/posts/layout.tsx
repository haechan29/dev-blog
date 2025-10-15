import PostSidebar from '@/components/post/postSidebar';
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
    <>
      <Suspense>
        <PostSidebar posts={postProps} />
      </Suspense>
      {children}
    </>
  );
}
