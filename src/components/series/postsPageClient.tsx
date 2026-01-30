'use client';

import PostPreview from '@/components/post/postPreview';
import usePosts from '@/features/post/hooks/usePosts';
import { PostProps } from '@/features/post/ui/postProps';
import { userKeys } from '@/queries/keys';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

export default function PostsPageClient({
  userId,
  currentUserId,
  isLoggedIn,
  isCreator,
  initialPosts,
}: {
  userId: string;
  currentUserId?: string;
  isLoggedIn: boolean;
  isCreator: boolean;
  initialPosts: PostProps[];
}) {
  const queryClient = useQueryClient();

  const { posts } = usePosts(userId, initialPosts);

  const handleDeleteSuccess = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: userKeys.posts(userId) });
  }, [queryClient, userId]);

  const handleVisibilitySuccess = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: userKeys.posts(userId) });
  }, [queryClient, userId]);

  return !posts || posts.length === 0 ? (
    <div className='text-center py-20 text-gray-500'>작성한 글이 없습니다.</div>
  ) : (
    <div className='flex flex-col'>
      {posts.map((post, index) => (
        <div key={post.id} className='mb-8'>
          <PostPreview
            isLoggedIn={isLoggedIn}
            post={post}
            userId={currentUserId}
            showSettings={true}
            isCreatorOwner={isCreator && post.userId === currentUserId}
            onDeleteSuccess={handleDeleteSuccess}
            onVisibilitySuccess={handleVisibilitySuccess}
          />
          {index !== posts.length - 1 && <div className='h-px bg-gray-200' />}
        </div>
      ))}
    </div>
  );
}
