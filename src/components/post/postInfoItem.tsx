'use client';

import { PostItemProps } from '@/features/post/ui/postItemProps';
import { fetchPostStat } from '@/features/postStat/domain/service/postStatService';
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { Heart } from 'lucide-react';

export default function PostInfoItem({
  post,
  className,
}: {
  post: PostItemProps;
  className?: string;
}) {
  const { data: stat } = useQuery({
    queryKey: ['posts', post.slug, 'stats'],
    queryFn: () => fetchPostStat(post.slug).then(stat => stat.toProps()),
  });

  return (
    <div className={clsx(className)}>
      <div className='flex gap-4 items-center text-xs text-gray-500'>
        {post.date}
        <div className='flex items-center gap-1'>
          <Heart className='w-3 h-3 fill-gray-500' />
          <span>{stat?.likeCount ?? 0}</span>
        </div>
        <span>조회 {stat?.viewCount ?? 0}</span>
      </div>
    </div>
  );
}
