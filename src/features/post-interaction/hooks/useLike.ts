'use client';

import * as InteractionRepository from '@/features/post-interaction/data/repository/interactionRepository';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export default function useLike({ postId }: { postId: string }) {
  const queryClient = useQueryClient();

  const { data: isLiked = false } = useQuery({
    queryKey: ['posts', postId, 'like'],
    queryFn: () => InteractionRepository.getIsLiked(postId),
  });

  const toggleLike = useMutation({
    mutationFn: () =>
      isLiked
        ? InteractionRepository.removeLike(postId)
        : InteractionRepository.addLike(postId),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['posts', postId, 'like'] });
      const previous = queryClient.getQueryData(['posts', postId, 'like']);

      queryClient.setQueryData(['posts', postId, 'like'], !isLiked);

      return { previous };
    },
    onError: (_error, _variables, context) => {
      queryClient.setQueryData(['posts', postId, 'like'], context?.previous);
    },
  });

  return { isLiked, toggleLike } as const;
}
