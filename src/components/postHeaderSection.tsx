'use client';

import { PostItemProps } from '@/features/post/ui/postItemProps';
import Link from 'next/link';
import PostInfoItem from '@/components/postInfoItem';
import ActiveHeadingDetector from '@/components/activeHeadingChecker';
import HeaderSectionDetector from '@/components/headerSectionDetector';
import { useRef } from 'react';

export default function PostHeaderSection({
  post,
  className,
}: {
  post: PostItemProps;
  className?: string;
}) {
  const headerRef = useRef(null);

  return (
    <section className={className}>
      <ActiveHeadingDetector headings={post.headings} />
      <HeaderSectionDetector headerRef={headerRef} />

      <div ref={headerRef}>
        <div className='text-3xl font-bold mb-6'>{post.title}</div>
        <div className='flex flex-wrap gap-3 mb-6'>
          {post.tags?.map(tag => (
            <Link
              key={tag}
              href={`/posts?tag=${tag}`}
              className='text-xs px-2 py-1 border border-gray-300 rounded-full hover:text-blue-500 hover:border-blue-200'
            >
              {tag}
            </Link>
          ))}
        </div>
        <PostInfoItem post={post} />
      </div>
    </section>
  );
}
