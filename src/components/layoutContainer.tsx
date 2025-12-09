'use client';

import PostsToolbar from '@/components/post/postsToolbar';
import clsx from 'clsx';
import { usePathname } from 'next/navigation';
import { ReactNode, Suspense } from 'react';

export default function LayoutContainer({
  isLoggedIn,
  children,
}: {
  isLoggedIn: boolean;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const isPostsPage = pathname === '/';

  if (!isPostsPage) return children;

  return (
    <>
      <Suspense>
        <PostsToolbar isLoggedIn={isLoggedIn} />
      </Suspense>

      <div
        className={clsx(
          'px-6 md:px-12 xl:px-18',
          'mt-(--toolbar-height) mb-20'
        )}
      >
        {children}
      </div>
    </>
  );
}
