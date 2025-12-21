'use client';

import useLike from '@/features/post-interaction/hooks/useLike';
import useThrottle from '@/hooks/useThrottle';
import clsx from 'clsx';
import { Heart } from 'lucide-react';
import { useCallback, useState } from 'react';

export default function LikeButton({
  postId,
  likeCount,
}: {
  postId: string;
  likeCount: number;
}) {
  const throttle = useThrottle();

  const { isLiked, toggleLike } = useLike({ postId });
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = useCallback(() => {
    throttle(() => {
      toggleLike.mutate();
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 300);
    }, 1000);
  }, [throttle, toggleLike]);

  return (
    <div className='flex justify-center mb-20'>
      <button
        onClick={handleClick}
        className={clsx(
          'flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-300',
          isLiked && isAnimating && 'scale-105',
          isLiked
            ? 'border-red-300 bg-red-50'
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

        <div
          className={clsx(
            'relative text-sm overflow-hidden',
            isLiked ? 'text-red-600' : 'text-gray-600'
          )}
        >
          <div className={clsx(isAnimating && 'invisible')}>
            {isLiked ? likeCount + 1 : likeCount}
          </div>
          <div
            className={clsx(
              'absolute top-0 inset-x-0 mx-auto transition-transform duration-300 ease-out',
              isLiked && '-translate-y-[50%]',
              !isAnimating && 'invisible'
            )}
          >
            <div>{likeCount}</div>
            <div>{likeCount + 1}</div>
          </div>
        </div>
      </button>
    </div>
  );
}
