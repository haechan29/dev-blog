'use client';

import PostSidebarNav from '@/components/post/postSidebarNav';
import Sidebar from '@/components/sidebar';
import usePosts from '@/features/post/hooks/usePosts';
import useScrollLock from '@/hooks/useScrollLock';
import { setIsVisible } from '@/lib/redux/post/postSidebarSlice';
import { AppDispatch, RootState } from '@/lib/redux/store';
import { postKeys } from '@/queries/keys';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
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

  const { posts } = usePosts(userId);

  useScrollLock({ isLocked: isVisible });

  useEffect(() => {
    if (posts) {
      posts.forEach(post => {
        queryClient.setQueryData(postKeys.detail(post.id), post);
      });
    }
  }, [posts, queryClient]);

  return (
    <Sidebar
      isVisible={isVisible}
      onClose={() => dispatch(setIsVisible(false))}
    >
      {posts && <PostSidebarNav currentPostId={currentPostId} posts={posts} />}
    </Sidebar>
  );
}
