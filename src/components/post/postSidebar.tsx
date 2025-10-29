'use client';

import PostSidebarFooter from '@/components/post/postSidebarFooter';
import PostSidebarHeader from '@/components/post/postSidebarHeader';
import PostSidebarNav from '@/components/post/postSidebarNav';
import useSidebarSwipe from '@/features/post/hooks/useSidebarSwipe';
import { PostProps } from '@/features/post/ui/postProps';
import useMediaQuery from '@/hooks/useMediaQuery';
import { RootState } from '@/lib/redux/store';
import clsx from 'clsx';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';

export default function PostSidebar({ posts }: { posts: PostProps[] }) {
  const pathname = usePathname();
  const isEditing = useMemo(() => pathname.includes('/edit'), [pathname]);
  const isLargerThanXl = useMediaQuery('(min-width: 1280px)');
  const postSidebar = useSelector((state: RootState) => state.postSidebar);
  const isVisible = useMemo(
    () => !isEditing && (isLargerThanXl || postSidebar.isVisible),
    [isEditing, isLargerThanXl, postSidebar.isVisible]
  );

  const swipeHandlers = useSidebarSwipe();

  return (
    <div
      {...swipeHandlers}
      className={clsx(
        'fixed z-50 left-0 top-0 bottom-0 w-72 h-dvh flex flex-col',
        'bg-[#fafbfc] border-r border-r-gray-50',
        'transition-transform duration-300 ease-in-out',
        !isVisible && '-translate-x-full'
      )}
    >
      <PostSidebarHeader />
      <PostSidebarNav posts={posts} />
      <PostSidebarFooter />
    </div>
  );
}
