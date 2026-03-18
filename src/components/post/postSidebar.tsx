'use client';

import PostSidebarNav from '@/components/post/postSidebarNav';
import Sidebar from '@/components/sidebar';
import usePosts from '@/features/post/hooks/usePosts';
import useScrollLock from '@/hooks/useScrollLock';
import { postKeys } from '@/queries/keys';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

export default function PostSidebar({
  authorId,
  currentPostId,
  isVisible,
  onClose,
}: {
  authorId: string;
  currentPostId: string;
  isVisible: boolean;
  onClose: () => void;
}) {
  const queryClient = useQueryClient();

  const { posts } = usePosts(authorId);

  useScrollLock({ isLocked: isVisible });

  useEffect(() => {
    if (posts) {
      posts.forEach(post => {
        queryClient.setQueryData(postKeys.detail(post.id), post);
      });
    }
  }, [posts, queryClient]);

  return (
    <Sidebar isVisible={isVisible} onClose={onClose}>
      {posts && <PostSidebarNav currentPostId={currentPostId} posts={posts} />}
    </Sidebar>
  );
}
