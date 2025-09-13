'use client';

import PostToolbar from '@/components/postToolbar';
import { PostItemProps } from '@/features/post/ui/postItemProps';
import Link from 'next/link';
import PostInfoItem from '@/components/postInfoItem';
import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';

export default function PostHeaderSection({
  post,
  className,
}: {
  post: PostItemProps;
  className?: string;
}) {
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const headerRef = useRef(null);

  useEffect(() => {
    const headerObserver = new IntersectionObserver(
      entries => setIsHeaderVisible(entries[0].isIntersecting),
      {
        rootMargin: '-80px 0px -100% 0px',
      }
    );
    if (headerRef.current) {
      headerObserver.observe(headerRef.current);
    }
    return () => headerObserver.disconnect();
  }, []);

  return (
    <div className={className}>
      <div className='block xl:hidden mb-4'>
        <PostToolbar
          title={post.title}
          headings={post.headings}
          isHeaderVisible={isHeaderVisible}
        />
      </div>

      <section ref={headerRef}>
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
      </section>
    </div>
  );
}
