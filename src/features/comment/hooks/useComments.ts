'use client';

import * as CommentClientService from '@/features/comment/domain/service/commentClientService';
import { getComments } from '@/features/comment/domain/service/commentClientService';
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';

export default function useComments({ postId }: { postId: string }) {
  const queryClient = useQueryClient();

  const { data: comments } = useSuspenseQuery({
    queryKey: ['posts', postId, 'comments'],
    queryFn: async () => {
      const comments = await getComments(postId);
      return comments.map(comment => comment.toProps());
    },
  });

  const createCommentMutation = useMutation({
    mutationFn: (params: {
      postId: string;
      authorName: string;
      content: string;
      password: string;
    }) => CommentClientService.createComment(params),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['posts', postId, 'comments'],
      });
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
      password: string;
    }) => CommentClientService.deleteComment(postId, commentId, password),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['posts', postId, 'comments'],
      });
    },
  });

  return { comments, createCommentMutation, deleteCommentMutation } as const;
}
