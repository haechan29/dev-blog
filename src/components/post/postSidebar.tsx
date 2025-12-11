'use client';

import PostSidebarNav from '@/components/post/postSidebarNav';
import usePosts from '@/features/post/hooks/usePosts';
import useScrollLock from '@/hooks/useScrollLock';
import { setIsVisible } from '@/lib/redux/post/postSidebarSlice';
import { AppDispatch, RootState } from '@/lib/redux/store';
import { cn } from '@/lib/utils';
import { useQueryClient } from '@tanstack/react-query';
import clsx from 'clsx';
import { Menu } from 'lucide-react';
import { useCallback, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export default function PostSidebar({
  userId,
  currentPostId,
}: {
  userId: string;
  currentPostId: string;
}) {
  const dispatch = useDispatch<AppDispatch>();
  const queryClient = useQueryClient();
  const isVisible = useSelector((state: RootState) => {
    return state.postSidebar.isVisible;
  });
  const startRef = useRef<[number, number] | null>(null);
  const scrollDirectionRef = useRef<'horizontal' | 'vertical' | null>(null);

  const { posts } = usePosts(userId);

  const handleTouchStart = useCallback((e: React.TouchEvent<HTMLElement>) => {
    const sidebar = e.currentTarget;
    startRef.current = [e.touches[0].clientX, e.touches[0].clientY];
    sidebar.style.transition = 'none';
    scrollDirectionRef.current = null;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLElement>) => {
    const sidebar = e.currentTarget;

    const start = startRef.current;
    const scrollDirection = scrollDirectionRef.current;
    if (start === null) return;

    const [currentX, currentY] = [e.touches[0].clientX, e.touches[0].clientY];

    if (!scrollDirection) {
      const deltaX = currentX - start[0];
      const deltaY = currentY - start[1];
      scrollDirectionRef.current =
        Math.abs(deltaX) > Math.abs(deltaY) ? 'horizontal' : 'vertical';
    }

    if (scrollDirection === 'horizontal') {
      const translateX = Math.min(currentX - start[0], 0);
      sidebar.style.transform = `translateX(${translateX}px)`;
    }
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent<HTMLElement>) => {
      const sidebar = e.currentTarget;

      const start = startRef.current;
      if (start === null) return;

      if (scrollDirectionRef.current === 'horizontal') {
        const currentX = e.changedTouches[0].clientX;
        const translateX = Math.min(currentX - start[0], 0);
        const threshold = -sidebar.getBoundingClientRect().width * 0.3;

        if (translateX > threshold) {
          dispatch(setIsVisible(true));
        } else {
          dispatch(setIsVisible(false));
        }
      }

      sidebar.style.transition = '';
      sidebar.style.transform = '';
      startRef.current = null;
      scrollDirectionRef.current = null;
    },
    [dispatch]
  );

  useScrollLock({ isLocked: isVisible });

  useEffect(() => {
    if (posts) {
      posts.forEach(post => {
        queryClient.setQueryData(['post', post.id], post);
      });
    }
  }, [posts, queryClient]);

  return (
    <>
      <div
        onClick={() => {
          dispatch(setIsVisible(false));
        }}
        className={clsx(
          'fixed inset-0 z-40 bg-black/70 xl:hidden',
          'transition-opacity duration-300 ease-in-out',
          isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
      />

      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className={cn(
          'w-(--sidebar-width) fixed z-50',
          'left-0 top-0 xl:top-(--toolbar-height) bottom-0',
          'flex flex-col bg-white',
          'pb-2 md:pb-3 px-4 md:px-6',
          'transition-transform duration-300 ease-in-out',
          !isVisible && 'max-xl:-translate-x-full'
        )}
      >
        <div className='xl:hidden flex items-center gap-2 md:gap-3 py-2 md:py-3'>
          <button
            onClick={() => {
              dispatch(setIsVisible(false));
            }}
            className='shrink-0 p-2 -m-2 items-center justify-center'
            aria-label='메뉴 열기'
          >
            <Menu className='w-6 h-6 text-gray-500' />
          </button>
        </div>

        {posts && (
          <PostSidebarNav currentPostId={currentPostId} posts={posts} />
        )}
      </div>
    </>
  );
}
