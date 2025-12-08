'use client';

import LayoutContainer from '@/components/layoutContainer';
import { PostProps } from '@/features/post/ui/postProps';
import useUser from '@/features/user/domain/hooks/useUser';
import { usePathname, useSearchParams } from 'next/navigation';
import nProgress from 'nprogress';
import { ReactNode, Suspense, useEffect, useRef } from 'react';

export default function LayoutClient({
  authUserId,
  cookieUserId,
  posts,
  children,
}: {
  authUserId: string | null;
  cookieUserId: string | null;
  posts: PostProps[];
  children: ReactNode;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isCreatedRef = useRef(false);

  const { createUserMutation } = useUser();

  useEffect(() => {
    if (!authUserId && !cookieUserId && !isCreatedRef.current) {
      isCreatedRef.current = true;
      createUserMutation.mutate();
    }
  }, [authUserId, cookieUserId, createUserMutation]);

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
