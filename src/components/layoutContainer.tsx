'use client';

import PostSidebar from '@/components/post/postSidebar';
import PostsToolbar from '@/components/post/postsToolbar';
import PostToolbar from '@/components/post/postToolbar';
import { PostProps } from '@/features/post/ui/postProps';
import clsx from 'clsx';
import { Session } from 'next-auth';
import { usePathname } from 'next/navigation';
import { ReactNode, Suspense } from 'react';

export default function LayoutContainer({
  posts,
  session,
  children,
}: {
  posts: PostProps[];
  session: Session | null;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const isPostsPage = pathname === '/';
  const isPostPage = pathname.match(/^\/read\/[^/]+$/);

  if (!isPostsPage && !isPostPage) return children;

  return (
    <>
      <Suspense>
        {isPostsPage && <PostsToolbar session={session} />}
        {isPostPage && (
          <>
            <PostsToolbar session={session} className='max-xl:hidden' />
            <PostToolbar className='xl:hidden' />
          </>
        )}
        <PostSidebar posts={posts} />
      </Suspense>

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
