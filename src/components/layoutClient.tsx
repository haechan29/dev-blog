'use client';

import LayoutContainer from '@/components/layoutContainer';
import useUser from '@/features/user/domain/hooks/useUser';
import { usePathname, useSearchParams } from 'next/navigation';
import nProgress from 'nprogress';
import { ReactNode, useEffect, useRef } from 'react';

export default function LayoutClient({
  shouldCreateUser,
  isLoggedIn,
  children,
}: {
  shouldCreateUser: boolean;
  isLoggedIn: boolean;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isCreatedRef = useRef(false);

  const { createUserMutation } = useUser();

  useEffect(() => {
    if (shouldCreateUser && !isCreatedRef.current) {
      isCreatedRef.current = true;
      createUserMutation.mutate();
    }
  }, [createUserMutation, shouldCreateUser]);

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

  return <LayoutContainer isLoggedIn={isLoggedIn}>{children}</LayoutContainer>;
}
