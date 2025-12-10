'use client';

import * as CommentClientService from '@/features/comment/domain/service/commentClientService';
import { getComments } from '@/features/comment/domain/service/commentClientService';
import { CommentItemProps } from '@/features/comment/ui/commentItemProps';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export default function useComments({
  postId,
  initialComments,
}: {
  postId: string;
  initialComments?: CommentItemProps[];
}) {
  const queryClient = useQueryClient();

  const { data: comments } = useQuery({
    queryKey: ['posts', postId, 'comments'],
    queryFn: async () => {
      const comments = await getComments(postId);
      return comments.map(comment => comment.toProps());
    },
    initialData: initialComments,
  });

  const createCommentMutation = useMutation({
    mutationFn: (params: {
      postId: string;
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
