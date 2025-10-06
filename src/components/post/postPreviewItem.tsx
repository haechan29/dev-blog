'use client';

import PostInfoItem from '@/components/post/postInfoItem';
import { PostProps } from '@/features/post/ui/postProps';
import clsx from 'clsx';
import Link from 'next/link';
import { useMemo, useState } from 'react';

export default function PostPreviewItem({
  tag,
  post,
}: {
  tag: string | null;
  post: PostProps;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const contentScale = useMemo(() => (isHovered ? 1.2 : 1), [isHovered]);

  return (
    <div
      className='w-full py-8 border-b border-b-gray-200 text-gray-900'
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link
        href={`/posts/${post.slug}${tag ? `?tag=${tag}` : ''}`}
        className='text-gray-900'
      >
        <div className='text-2xl font-semibold mb-4 line-clamp-2'>
          {post.title}
        </div>

        <div className='relative mb-4 h-18'>
          <div
            className={clsx(
              'absolute left-0 top-0 leading-6',
              'transition-transform|discrete duration-300 ease-in-out',
              'scale-[var(--content-scale)] origin-top-left',
              'w-[calc(100%/var(--content-scale))]',
              isHovered ? 'h-30 line-clamp-5' : 'h-18 line-clamp-3'
            )}
            style={{
              '--content-scale': contentScale,
            }}
          >
            {post.plainText}
          </div>
        </div>
      </Link>

      <div
        className={clsx(
          'flex flex-wrap gap-2 mb-4',
          'transition-opacity duration-300 ease-in-out',
          isHovered && 'opacity-0 pointer-events-none'
        )}
      >
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

      <PostInfoItem isVisible={!isHovered} post={post} />
    </div>
  );
}
