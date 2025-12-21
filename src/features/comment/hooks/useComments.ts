'use client';

import * as CommentClientService from '@/features/comment/domain/service/commentClientService';
import { getComments } from '@/features/comment/domain/service/commentClientService';
import { CommentItemProps } from '@/features/comment/ui/commentItemProps';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

export default function useComments({
  postId,
  initialComments,
}: {
  postId: string;
  initialComments?: CommentItemProps[];
}) {
  const queryClient = useQueryClient();
  const [timestamp] = useState(() => new Date().toISOString());

  const { data: comments } = useQuery({
    queryKey: ['posts', postId, 'comments'],
    queryFn: async () => {
      const comments = await getComments(postId, timestamp);
      return comments.map(comment => comment.toProps());
    },
    initialData: initialComments,
  });

  const createCommentMutation = useMutation({
    mutationFn: (params: {
      postId: string;
      content: string;
      password?: string;
    }) => CommentClientService.createComment(params),
    onSuccess: newComment => {
      queryClient.setQueryData(
        ['posts', postId, 'comments'],
        (old: CommentItemProps[]) => [newComment.toProps(), ...old]
      );
    },
  });

  const updateCommentMutation = useMutation({
    mutationFn: (params: {
      postId: string;
      commentId: number;
      content: string;
      password?: string;
    }) => CommentClientService.updateComment(params),
    onSuccess: updatedComment => {
      queryClient.setQueryData(
        ['posts', postId, 'comments'],
        (old: CommentItemProps[]) => {
          return old.map(comment =>
            comment.id === updatedComment.id
              ? updatedComment.toProps()
              : comment
          );
        }
      );
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: ({
      postId,
      commentId,
      password,
    }: {
      postId: string;
      commentId: number;
      password?: string;
    }) => CommentClientService.deleteComment(postId, commentId, password),
    onSuccess: (_, variables) => {
      queryClient.setQueryData(
        ['posts', postId, 'comments'],
        (old: CommentItemProps[]) => {
          return old.filter(comment => comment.id !== variables.commentId);
        }
      );
    },
  });

  return {
    comments,
    createCommentMutation,
    updateCommentMutation,
    deleteCommentMutation,
  } as const;
}
