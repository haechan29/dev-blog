'use client';

import useLike from '@/features/post-interaction/hooks/useLike';
import usePostStat from '@/features/postStat/hooks/usePostStat';
import useThrottle from '@/hooks/useThrottle';
import clsx from 'clsx';
import { Heart } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';

export default function LikeButton({ postId }: { postId: string }) {
  const throttle = useThrottle();

  const { isLiked, toggleLike } = useLike({ postId });
  const { stat, incrementLikeCount } = usePostStat({ postId });

  const handleClick = useCallback(() => {
    throttle(() => {
      toggleLike.mutate();
    }, 1000);
  }, [throttle, toggleLike]);

  return (
    <div className='flex justify-center mb-20'>
      <button
        onClick={handleClick}
        className={clsx(
          'flex items-center gap-2 px-6 py-3 rounded-lg border transition-all duration-300 hover:scale-105',
          isLiked
            ? 'border-red-300 bg-red-50 shadow-lg shadow-red-200/50'
            : 'border-gray-200 hover:bg-gray-50 hover:border-gray-300'
        )}
      >
        <Heart
          size={20}
          className={clsx(
            'transition-color duration-300 ease-out',
            isLiked ? 'text-red-500 fill-red-500' : 'text-gray-400'
          )}
        />

        <RollingCounter heartFilled={isLiked} count={stat.likeCount} />
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
  const [prevCount, setPrevCount] = useState(0);
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
