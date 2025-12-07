'use client';

import LayoutContainer from '@/components/layoutContainer';
import { PostProps } from '@/features/post/ui/postProps';
import * as UserAction from '@/features/user/domain/action/userAction';
import { usePathname, useSearchParams } from 'next/navigation';
import nProgress from 'nprogress';
import { ReactNode, Suspense, useEffect } from 'react';

export default function LayoutClient({
  userId,
  posts,
  children,
}: {
  userId: string | null;
  posts: PostProps[];
  children: ReactNode;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleNewUser = async () => {
      if (!userId) {
        try {
          await UserAction.createUser();
        } catch {}
      }
    };
    handleNewUser();
  }, [userId]);

  useEffect(() => {
    nProgress.done();
  }, [pathname, searchParams]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a');

      if (
        link &&
        link.href &&
        e.button === 0 &&
        !e.ctrlKey &&
        !e.metaKey &&
        link.href.startsWith(window.location.origin) &&
        link.pathname !== pathname
      ) {
        nProgress.start();
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [pathname]);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      import('eruda').then(eruda => eruda.default.init());
    }
  }, []);

  return (
    <LayoutContainer posts={posts}>
      <Suspense>{children}</Suspense>
    </LayoutContainer>
  );
}
