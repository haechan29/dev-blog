'use client';

import usePostStat from '@/features/postStat/hooks/usePostStat';
import clsx from 'clsx';
import { Heart } from 'lucide-react';

export default function PostInfo({
  id: postId,
  createdAt,
}: {
  id: string;
  createdAt: string;
}) {
  const { stat } = usePostStat({ postId });

  return (
    <div
      className={clsx(
        'flex gap-4 items-center text-xs text-gray-500',
        'group-hover:opacity-0 transition-opacity duration-300 ease-in-out'
      )}
    >
      <div>{createdAt}</div>
      <div className='flex items-center gap-1'>
        <Heart className='w-3 h-3 fill-gray-500' />
        <div>{stat.likeCount}</div>
      </div>
      <div>{`조회 ${stat.viewCount}`}</div>
    </div>
  );
}
