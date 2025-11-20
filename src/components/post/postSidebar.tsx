'use client';

import PostSidebarFooter from '@/components/post/postSidebarFooter';
import PostSidebarHeader from '@/components/post/postSidebarHeader';
import PostSidebarNav from '@/components/post/postSidebarNav';
import { PostProps } from '@/features/post/ui/postProps';
import { setIsVisible } from '@/lib/redux/post/postSidebarSlice';
import { AppDispatch, RootState } from '@/lib/redux/store';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export default function PostSidebar({
  posts,
  className,
}: {
  posts: PostProps[];
  className?: string;
}) {
  const dispatch = useDispatch<AppDispatch>();
  const pathname = usePathname();
  const isVisible = useSelector((state: RootState) => {
    return state.postSidebar.isVisible;
  });
  const startRef = useRef<[number, number] | null>(null);
  const scrollDirectionRef = useRef<'horizontal' | 'vertical' | null>(null);

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
      e.preventDefault();
      document.body.style.overflow = 'hidden';
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
      document.body.style.overflow = '';
      startRef.current = null;
      scrollDirectionRef.current = null;
    },
    [dispatch]
  );

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className={cn(
        'w-[var(--sidebar-width)] flex flex-col',
        'transition-transform duration-300 ease-in-out',
        !pathname.includes('/edit') && !isVisible && 'max-xl:-translate-x-full',
        className
      )}
    >
      <PostSidebarHeader />
      <PostSidebarNav posts={posts} />
      <PostSidebarFooter />
    </div>
  );
}
