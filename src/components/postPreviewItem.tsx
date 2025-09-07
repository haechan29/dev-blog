'use client';

import { PostItemProps } from '@/features/post/ui/postItemProps';
import { fetchPostStat } from '@/features/postStat/domain/service/postStatService';
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { BarChart3, Calendar, Heart, Tag } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

function PostStatSection({ post }: { post: PostItemProps }) {
  const { data: stat } = useQuery({
    queryKey: ['posts', post.slug, 'stats'],
    queryFn: () => fetchPostStat(post.slug).then(stat => stat.toProps()),
  });

  return (
    <div className='flex items-center gap-4'>
      <div className='flex items-center gap-1 text-gray-500'>
        <Heart className='w-4 h-4' />
        <span className='text-sm'>{stat?.likeCount ?? 0}</span>
      </div>

      <div className='flex items-center gap-1 text-gray-500'>
        <BarChart3 className='w-4 h-4' />
        <span className='text-sm'>{stat?.viewCount ?? 0}</span>
      </div>
    </div>
  );
}

export default function PostPreviewItem({ post }: { post: PostItemProps }) {
  const [isTextAreaExpanded, setIsTextAreaExpanded] = useState(false);
  const timerRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return (
    <div className={clsx('w-full py-8 border-b border-b-gray-200')}>
      <Link
        href={`/posts/${post.slug}`}
        onMouseEnter={() => {
          if (timerRef.current) {
            clearTimeout(timerRef.current);
          }
          timerRef.current = window.setTimeout(() => {
            setIsTextAreaExpanded(true);
          }, 500);
        }}
        onMouseLeave={() => {
          if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = undefined;
          }
          setIsTextAreaExpanded(false);
        }}
      >
        <div className='text-xl font-semibold text-gray-900 mb-4 truncate'>
          {post.title}
        </div>
        <div className='flex items-center text-sm text-gray-500 mb-4'>
          <Calendar className='w-4 h-4 mr-2' />
          {post.date}
        </div>
        <div
          className={clsx(
            'mb-4 overflow-hidden break-keep transition-discrete duration-500 leading-6 ',
            'bg-gradient-to-b from-black via-black bg-clip-text text-transparent',
            isTextAreaExpanded
              ? 'max-h-[432px] to-white '
              : 'max-h-[72px] to-black'
          )}
        >
          {post.plainText}
        </div>
      </Link>

      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <PostStatSection post={post} />

        <div className='flex items-center gap-2'>
          <Tag className='w-4 h-4 text-gray-400' />
          <div className='flex flex-wrap gap-2'>
            {post.tags.map(tag => (
              <div
                key={tag}
                className='text-xs px-2 py-1 border border-gray-300 rounded-full'
              >
                {tag}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
