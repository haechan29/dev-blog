'use client';

import LayoutContainer from '@/components/layoutContainer';
import { PostProps } from '@/features/post/ui/postProps';
import useUser from '@/features/user/domain/hooks/useUser';
import { usePathname, useSearchParams } from 'next/navigation';
import nProgress from 'nprogress';
import { ReactNode, Suspense, useEffect } from 'react';

export default function LayoutClient({
  posts,
  children,
}: {
  posts: PostProps[];
  children: ReactNode;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { user, createUserMutation } = useUser();

  useEffect(() => {
    if (!user) {
      createUserMutation.mutate();
    }
  }, [createUserMutation, user]);

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
