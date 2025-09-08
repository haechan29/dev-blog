'use client';

import useThrottle from '@/hooks/useThrottle';
import clsx from 'clsx';
import { Heart } from 'lucide-react';
import { useState } from 'react';

export default function LikeSection({
  postId,
  className,
}: {
  postId: string;
  className?: string;
}) {
  const [count, setCount] = useState(0);
  const [heartFilled, setHeartFilled] = useState(false);
  const [isRolling, setIsRolling] = useState(false);

  const [throttledCall] = useThrottle(1000);

  const handleClick = () => {
    throttledCall(() => {
      setHeartFilled(true);
      setIsRolling(true);
    });
  };

  const handleTextRolling = (e: React.TransitionEvent<HTMLDivElement>) => {
    if (isRolling) {
      setCount(prev => prev + 1);
      setIsRolling(false);
    }
  };

  const handleFillingHeart = (e: React.TransitionEvent<HTMLButtonElement>) => {
    if (heartFilled) {
      setTimeout(() => setHeartFilled(false), 300);
    }
  };

  return (
    <div className={clsx(className)}>
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
            onTransitionEnd={handleTextRolling}
          >
            <span
              className={clsx(
                'h-6 flex items-center justify-center',
                heartFilled ? 'text-red-600' : 'text-gray-600'
              )}
            >
              {count}
            </span>
            <span
              className={clsx(
                'h-6 flex items-center justify-center',
                heartFilled ? 'text-red-600' : 'text-gray-600'
              )}
            >
              {count + 1}
            </span>
          </div>
        </div>
      </button>
    </div>
  );
}
