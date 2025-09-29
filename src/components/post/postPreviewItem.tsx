'use client';

import PostInfoItem from '@/components/post/postInfoItem';
import { PostItemProps } from '@/features/post/ui/postItemProps';
import clsx from 'clsx';
import Link from 'next/link';

export default function PostPreviewItem({
  tag,
  post,
}: {
  tag: string | null;
  post: PostItemProps;
}) {
  return (
    <div className={clsx('w-full py-8 border-b border-b-gray-200')}>
      <Link href={`/posts/${post.slug}${tag ? `?tag=${tag}` : ''}`}>
        <div className='text-2xl font-semibold text-gray-900 mb-4 line-clamp-2'>
          {post.title}
        </div>

        <div className='mb-4 break-keep leading-6 line-clamp-3'>
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
