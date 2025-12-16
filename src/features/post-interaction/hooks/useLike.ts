'use client';

import * as InteractionRepository from '@/features/post-interaction/data/repository/interactionRepository';
import { useQuery } from '@tanstack/react-query';

export default function useLike({ postId }: { postId: string }) {
  const { data: isLiked = false } = useQuery({
    queryKey: ['posts', postId, 'like'],
    queryFn: () => InteractionRepository.getIsLiked(postId),
  });

  return { isLiked } as const;
}
