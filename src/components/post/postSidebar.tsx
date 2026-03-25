'use client';

import PostSidebarNav from '@/components/post/postSidebarNav';
import Sidebar from '@/components/sidebar';
import usePosts from '@/features/post/hooks/usePosts';
import useScrollLock from '@/hooks/useScrollLock';
import { Menu } from 'lucide-react';

export default function PostSidebar({
  authorId,
  currentPostId,
  isOpen,
  onClose,
}: {
  authorId: string;
  currentPostId: string;
  isOpen: boolean;
  onClose: () => void;
}) {
  const { posts } = usePosts(authorId);

  useScrollLock({ isLocked: isOpen });

  return (
    <Sidebar isOpen={isOpen} onClose={onClose}>
      <div className='xl:hidden flex items-center gap-2 md:gap-3 py-2 md:py-3'>
        <button
          onClick={onClose}
          className='shrink-0 p-2 -m-2 items-center justify-center'
          aria-label='메뉴 닫기'
        >
          <Menu className='w-6 h-6 text-gray-500' />
        </button>
      </div>

      {posts && <PostSidebarNav currentPostId={currentPostId} posts={posts} />}
    </Sidebar>
  );
}
