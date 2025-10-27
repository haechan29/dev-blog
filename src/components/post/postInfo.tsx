'use client';

import usePostStat from '@/features/postStat/hooks/usePostStat';
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
    <div className='flex gap-4 items-center text-xs text-gray-500'>
      <div>{createdAt}</div>
      <div className='flex items-center gap-1'>
        <Heart className='w-3 h-3 fill-gray-500' />
        <div>{stat.likeCount}</div>
      </div>
      <div>{`조회 ${stat.viewCount}`}</div>
    </div>
  );
}
