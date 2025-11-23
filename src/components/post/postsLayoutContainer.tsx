'use client';

import PostSidebar from '@/components/post/postSidebar';
import PostsToolbar from '@/components/post/postsToolbar';
import PostToolbar from '@/components/post/postToolbar';
import { PostProps } from '@/features/post/ui/postProps';
import clsx from 'clsx';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

export default function PostsLayoutContainer({
  posts,
  children,
}: {
  posts: PostProps[];
  children: ReactNode;
}) {
  const pathname = usePathname();
  const isEditPage = pathname.includes('/edit');

  if (isEditPage) return children;

  return (
    <>
      <ToolbarContainer />
      <PostSidebar posts={posts} />
      <div
        className={clsx(
          'mt-(--toolbar-height) mb-20 px-6 md:px-12 xl:px-18',
          'xl:ml-(--sidebar-width)',
          'xl:mr-[calc(var(--toc-width)+var(--toc-margin))]'
        )}
      >
        {children}
      </div>
    </>
  );
}

function ToolbarContainer() {
  const pathname = usePathname();

  if (pathname.includes('/edit')) {
    return null;
  } else if (pathname === '/posts') {
    return <PostsToolbar />;
  } else if (pathname.match(/^\/posts\/[^/]+$/)) {
    return (
      <>
        <PostsToolbar className='max-xl:hidden' />
        <PostToolbar className='xl:hidden' />
      </>
    );
  } else {
    return null;
  }
}
