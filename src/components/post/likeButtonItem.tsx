'use client';

import * as PostStatService from '@/features/postStat/domain/service/postStatService';
import { fetchPostStat } from '@/features/postStat/domain/service/postStatService';
import { PostStatItemProps } from '@/features/postStat/ui/postStatItemProps';
import useThrottle from '@/hooks/useThrottle';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import clsx from 'clsx';
import { Heart } from 'lucide-react';
import { useMemo, useState } from 'react';

export default function LikeButtonItem({
  postId,
  className,
}: {
  postId: string;
  className?: string;
}) {
  const [heartFilled, setHeartFilled] = useState(false);
  const [throttledCall] = useThrottle(1000);

  const queryClient = useQueryClient();

  const { data: stat } = useQuery({
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

  const handleClick = () => {
    throttledCall(() => {
      setHeartFilled(true);
      incrementLikeCount.mutate();
    });
  };

  const handleFillingHeart = () => {
    if (heartFilled) {
      setTimeout(() => setHeartFilled(false), 300);
    }
  };

  return (
    <div className={className}>
      <button
        onClick={handleClick}
        className={clsx(
          'flex items-center gap-2 px-6 py-3 rounded-lg border transition-all duration-300 hover:scale-105',
          heartFilled
            ? 'border-red-300 bg-red-50 shadow-lg shadow-red-200/50'
            : 'border-gray-200 hover:bg-gray-50 hover:border-gray-300'
        )}
        onTransitionEnd={handleFillingHeart}
      >
        <Heart
          size={20}
          className={clsx(
            'transition-color duration-300 ease-out',
            heartFilled ? 'text-red-500 fill-red-500' : 'text-gray-400'
          )}
        />

        <RollingCounter
          heartFilled={heartFilled}
          count={stat?.likeCount ?? 0}
        />
      </button>
    </div>
  );
}

function RollingCounter({
  heartFilled,
  count,
}: {
  heartFilled: boolean;
  count: number;
}) {
  const [prevCount, setPrevCount] = useState(count);
  const isRolling = useMemo(() => count !== prevCount, [count, prevCount]);

  return (
    <div className='relative w-6 h-6 font-medium overflow-hidden flex items-center justify-center'>
      <span
        className={clsx(
          'absolute h-6 flex items-center justify-center',
          heartFilled ? 'text-red-600' : 'text-gray-600',
          isRolling && 'hidden'
        )}
      >
        {count}
      </span>
      <div
        className={clsx(
          'absolute flex flex-col font-medium transition-transform duration-300 ease-out',
          isRolling ? '-translate-y-3 visible' : 'translate-y-3 invisible'
        )}
        onTransitionEnd={() => setPrevCount(count)}
      >
        <span
          className={clsx(
            'h-6 flex items-center justify-center',
            heartFilled ? 'text-red-600' : 'text-gray-600'
          )}
        >
          {prevCount}
        </span>
        <span
          className={clsx(
            'h-6 flex items-center justify-center',
            heartFilled ? 'text-red-600' : 'text-gray-600'
          )}
        >
          {count}
        </span>
      </div>
    </div>
  );
}
