'use client';

import * as InteractionRepository from '@/features/post-interaction/data/repository/interactionRepository';
import { postKeys } from '@/queries/keys';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export default function useLike({ postId }: { postId: string }) {
  const queryClient = useQueryClient();

  const { data: isLiked } = useQuery({
    queryKey: postKeys.like(postId),
    queryFn: () => InteractionRepository.getIsLiked(postId),
  });

  const toggleLike = useMutation({
    mutationFn: () =>
      isLiked
        ? InteractionRepository.removeLike(postId)
        : InteractionRepository.addLike(postId),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: postKeys.like(postId) });
      const previous = queryClient.getQueryData(postKeys.like(postId));

      queryClient.setQueryData(postKeys.like(postId), !isLiked);

      return { previous };
    },
    onError: (_error, _variables, context) => {
      queryClient.setQueryData(postKeys.like(postId), context?.previous);
    },
  });

  return { isLiked, toggleLike } as const;
}
