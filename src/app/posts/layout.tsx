import PostSidebar from '@/components/post/postSidebar';
import Toolbar from '@/components/post/toolbar';
import { fetchPosts } from '@/features/post/domain/service/postService';
import { createProps } from '@/features/post/ui/postProps';
import clsx from 'clsx';
import { ReactNode } from 'react';

export default async function PostsLayout({
  children,
}: {
  children: ReactNode;
}) {
  const posts = await fetchPosts().then(posts => posts.map(createProps));

  return (
    <>
      <Toolbar />
      <PostSidebar
        posts={posts}
        className='fixed z-50 left-0 top-[var(--toolbar-height)] bottom-0'
      />
      <div
        className={clsx(
          'mt-[var(--toolbar-height)] mb-20 px-10 xl:px-20',
          'xl:ml-[var(--sidebar-width)]',
          'xl:mr-[calc(var(--toc-width)+var(--toc-margin))]'
        )}
      >
        {children}
      </div>
    </>
  );
}
