'use client';

import { PostItemProps } from '@/features/post/ui/postItemProps';
import Link from 'next/link';
import PostInfoItem from '@/components/postInfoItem';
import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/lib/redux/store';
import {
  setBreadcrumb,
  setIsContentVisible,
  setHeadings,
} from '@/lib/redux/postToolbarSlice';
import { useSearchParams } from 'next/navigation';
import { HeadingItemProps } from '@/features/post/ui/postToolbarProps';

export default function PostHeaderSection({
  post,
  className,
}: {
  post: PostItemProps;
  className?: string;
}) {
  const headerRef = useRef(null);
  const dispatch = useDispatch<AppDispatch>();

  const searchParams = useSearchParams();
  const tag = searchParams.get('tag');

  useEffect(() => {
    const headerObserver = new IntersectionObserver(
      entries => dispatch(setIsContentVisible(entries[0].isIntersecting)),
      {
        rootMargin: '-80px 0px -100% 0px',
      }
    );
    if (headerRef.current) {
      headerObserver.observe(headerRef.current);
    }
    return () => headerObserver.disconnect();
  }, []);

  useEffect(() => {
    if (tag !== null) {
      dispatch(setBreadcrumb([tag]));
    }
    const headingItemProps: HeadingItemProps[] = post.headings.map(heading => ({
      ...heading,
      isSelected: false,
    }));
    dispatch(setHeadings(headingItemProps));
  }, []);

  return (
    <div className={className}>
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
