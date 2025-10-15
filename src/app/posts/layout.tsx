import PostSidebar from '@/components/post/postSidebar';
import { fetchPosts } from '@/features/post/domain/service/postService';
import { createProps } from '@/features/post/ui/postProps';
import clsx from 'clsx';
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
      <div
        className={clsx(
          'xl:ml-[var(--sidebar-width)]',
          'xl:mr-[calc(var(--toc-width)+var(--toc-margin))]'
        )}
      >
        {children}
      </div>
    </>
  );
}
