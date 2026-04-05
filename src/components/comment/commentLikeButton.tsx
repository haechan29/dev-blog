'use client';

import * as CommentClientService from '@/features/comment/domain/service/commentClientService';
import { CommentsPage } from '@/features/comment/domain/types/page';
import { CommentItemProps } from '@/features/comment/ui/commentItemProps';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import useThrottle from '@/hooks/useThrottle';
import { postKeys } from '@/queries/keys';
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import clsx from 'clsx';
import { Heart } from 'lucide-react';
import { useCallback } from 'react';

export default function CommentLikeButton({
  comment,
  highlightCommentId,
}: {
  comment: CommentItemProps;
  highlightCommentId?: number;
}) {
  const queryClient = useQueryClient();
  const [isLiked, setIsLiked] = useLocalStorage(
    `comment-like-${comment.id}`,
    false
  );
  const throttle = useThrottle();

  const incrementLikeCount = useMutation({
    mutationFn: () =>
      CommentClientService.incrementLikeCount(comment.postId, comment.id),
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: postKeys.comments(comment.postId, highlightCommentId),
      });
      const previousComments = queryClient.getQueryData(
        postKeys.comments(comment.postId, highlightCommentId)
      );

      queryClient.setQueryData(
        postKeys.comments(comment.postId, highlightCommentId),
        (prev: InfiniteData<CommentsPage> | undefined) => {
          if (!prev) return prev;
          return {
            ...prev,
            pages: prev.pages.map(page => ({
              ...page,
              comments: page.comments.map(item =>
                item.id === comment.id
                  ? { ...item, likeCount: item.likeCount + 1 }
                  : item
              ),
            })),
          };
        }
      );

      return { previousComments };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousComments) {
        queryClient.setQueryData(
          postKeys.comments(comment.postId, highlightCommentId),
          context.previousComments
        );
      }
    },
  });

  const decrementLikeCount = useMutation({
    mutationFn: () =>
      CommentClientService.decrementLikeCount(comment.postId, comment.id),
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: postKeys.comments(comment.postId, highlightCommentId),
      });
      const previousComments = queryClient.getQueryData(
        postKeys.comments(comment.postId, highlightCommentId)
      );

      queryClient.setQueryData(
        postKeys.comments(comment.postId, highlightCommentId),
        (prev: InfiniteData<CommentsPage> | undefined) => {
          if (!prev) return prev;
          return {
            ...prev,
            pages: prev.pages.map(page => ({
              ...page,
              comments: page.comments.map(item =>
                item.id === comment.id
                  ? { ...item, likeCount: item.likeCount - 1 }
                  : item
              ),
            })),
          };
        }
      );

      return { previousComments };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousComments) {
        queryClient.setQueryData(
          postKeys.comments(comment.postId, highlightCommentId),
          context.previousComments
        );
      }
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
      <button
        onClick={toggleIsLiked}
        disabled={incrementLikeCount.isPending || decrementLikeCount.isPending}
        className='flex items-center space-x-1'
      >
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
