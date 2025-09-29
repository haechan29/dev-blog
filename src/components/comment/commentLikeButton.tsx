'use client';

import * as CommentService from '@/features/comment/domain/service/commentService';
import { CommentItemProps } from '@/features/comment/ui/commentItemProps';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import useThrottle from '@/hooks/useThrottle';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import clsx from 'clsx';
import { Heart } from 'lucide-react';
import { useCallback } from 'react';

export default function CommentLikeButton({
  comment,
}: {
  comment: CommentItemProps;
}) {
  const queryClient = useQueryClient();
  const [isLiked, setIsLiked] = useLocalStorage(
    `comment-like-${comment.id}`,
    false
  );
  const throttle = useThrottle();

  const incrementLikeCount = useMutation({
    mutationFn: () =>
      CommentService.incrementLikeCount(comment.postId, comment.id),
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: ['posts', comment.postId, 'comments'],
      });
      const previousComments = queryClient.getQueryData([
        'posts',
        comment.postId,
        'comments',
      ]);

      queryClient.setQueryData(
        ['posts', comment.postId, 'comments'],
        (prev: CommentItemProps[] | undefined) =>
          prev?.map(item =>
            item.id === comment.id
              ? {
                  ...item,
                  likeCount: item.likeCount + 1,
                }
              : item
          ) ?? prev
      );

      return { previousComments };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousComments) {
        queryClient.setQueryData(
          ['posts', comment.postId, 'comments'],
          context.previousComments
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ['posts', comment.postId, 'comments'],
      });
    },
  });

  const decrementLikeCount = useMutation({
    mutationFn: () =>
      CommentService.decrementLikeCount(comment.postId, comment.id),
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: ['posts', comment.postId, 'comments'],
      });
      const previousComments = queryClient.getQueryData([
        'posts',
        comment.postId,
        'comments',
      ]);

      queryClient.setQueryData(
        ['posts', comment.postId, 'comments'],
        (prev: CommentItemProps[] | undefined) =>
          prev?.map(item =>
            item.id === comment.id
              ? {
                  ...item,
                  likeCount: item.likeCount - 1,
                }
              : item
          ) ?? prev
      );

      return { previousComments };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousComments) {
        queryClient.setQueryData(
          ['posts', comment.postId, 'comments'],
          context.previousComments
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ['posts', comment.postId, 'comments'],
      });
    },
  });

  const toggleIsLiked = useCallback(() => {
    throttle(() => {
      if (isLiked) {
        decrementLikeCount.mutate();
        setIsLiked(false);
      } else {
        incrementLikeCount.mutate();
        setIsLiked(true);
      }
    }, 500);
  }, [decrementLikeCount, incrementLikeCount, isLiked, setIsLiked, throttle]);

  return (
    <div className='flex items-center space-x-4'>
      <button onClick={toggleIsLiked} className='flex items-center space-x-1'>
        <Heart
          size={16}
          className={clsx(
            'transition-colors duration-300 ease-in-out hover:text-red-500',
            isLiked
              ? 'fill-red-500 text-red-500 animate-pop'
              : 'fill-white text-gray-500'
          )}
        />
        <span className='text-sm'>{comment.likeCount}</span>
      </button>
    </div>
  );
}
