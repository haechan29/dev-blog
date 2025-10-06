'use client';

import { PostProps } from '@/features/post/ui/postProps';
import { fetchPostStat } from '@/features/postStat/domain/service/postStatService';
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { Heart } from 'lucide-react';

export default function PostInfoItem({
  isVisible = true,
  post,
}: {
  isVisible?: boolean;
  post: PostProps;
}) {
  const { data: stat } = useQuery({
    queryKey: ['posts', post.slug, 'stats'],
    queryFn: () => fetchPostStat(post.slug).then(stat => stat.toProps()),
  });

  return (
    <div
      className={clsx(
        'flex gap-4 items-center text-xs text-gray-500',
        !isVisible && 'opacity-0 transition-opacity duration-300 ease-in-out'
      )}
    >
      {post.date}
      <div className='flex items-center gap-1'>
        <Heart className='w-3 h-3 fill-gray-500' />
        <span>{stat?.likeCount ?? 0}</span>
      </div>
      <span>조회 {stat?.viewCount ?? 0}</span>
    </div>
  );
}
