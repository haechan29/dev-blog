'use client';

import { PostItemProps } from '@/features/post/ui/postItemProps';
import clsx from 'clsx';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import PostInfoItem from './postInfoItem';

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

  const onMouseEnter = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = window.setTimeout(() => {
      setIsTextAreaExpanded(true);
    }, 500);
  };

  const onMouseLeave = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = undefined;
    }
    setIsTextAreaExpanded(false);
  };

  return (
    <div className={clsx('w-full py-8 border-b border-b-gray-200')}>
      <Link
        href={`/posts/${post.slug}`}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <div className='text-2xl font-semibold text-gray-900 mb-4 line-clamp-2'>
          {post.title}
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

      <div className='flex flex-wrap gap-2 mb-4'>
        {post.tags.map(tag => (
          <Link
            href={`/posts?tag=${tag}`}
            key={tag}
            className='text-xs px-2 py-1 flex-shrink-0 border border-gray-300 rounded-full hover:text-blue-500 hover:border-blue-200'
          >
            {tag}
          </Link>
        ))}
      </div>

      <PostInfoItem post={post} />
    </div>
  );
}
