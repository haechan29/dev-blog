'use client';

import * as PostStatService from '@/features/postStat/domain/service/postStatService';
import { fetchPostStat } from '@/features/postStat/domain/service/postStatService';
import { PostStatItemProps } from '@/features/postStat/ui/postStatItemProps';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

export default function usePostStat({ postId }: { postId: string }) {
  const queryClient = useQueryClient();
  const [stat, setStat] = useState<PostStatItemProps>({
    likeCount: 0,
    viewCount: 0,
  });

  const { data } = useQuery({
    queryKey: ['posts', postId, 'stats'],
    queryFn: () => fetchPostStat(postId).then(stat => stat.toProps()),
  });

  const incrementLikeCount = useMutation({
    mutationFn: () => PostStatService.incrementLikeCount(postId),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['posts', postId, 'stats'] });
      const previousStat = queryClient.getQueryData(['posts', postId, 'stats']);

      queryClient.setQueryData(
        ['posts', postId, 'stats'],
        (prev: PostStatItemProps | undefined) => {
          if (!prev) return prev;
          return {
            ...prev,
            likeCount: prev.likeCount + 1,
          };
        }
      );

      return { previousStat };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousStat) {
        queryClient.setQueryData(
          ['posts', postId, 'stats'],
          context.previousStat
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ['posts', postId, 'stats'],
      });
    },
  });

  useEffect(() => {
    if (data) setStat(data);
  }, [data]);

  return { stat, incrementLikeCount } as const;
}
