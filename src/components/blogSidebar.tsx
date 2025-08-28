'use client';

import { PostItemProps } from '@/features/post/ui/postItemProps';
import clsx from 'clsx';
import { FileUser, Mail } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';

export default function BlogSidebar({ 
  className,
  posts
}: { 
  className: string;
  posts: PostItemProps[];
}) {
  const params = useParams();
  const searchParams = useSearchParams();
  const selectedSlug = params.slug as string | undefined;
  const selectedTag = searchParams.get('tag') ?? null;

  const tagCount = useMemo(() => {
    const tagMap = posts
      .flatMap(post => post.tags)
      .reduce((acc, tag) => acc.set(tag, (acc.get(tag) ?? 0) + 1), new Map<string, number>());
    return [...tagMap.entries()];
  }, [posts]);

  const postsOfTag = useMemo(() => {
    return selectedTag ? posts.filter(post => post.tags.includes(selectedTag)) : null;
  }, [posts, selectedTag]);

  return (
    <div className={clsx(
      className,
      'flex flex-col bg-blue-50/30'
    )}>
      <div className="px-6 py-9">
        <Link
          className='px-3 py-3 flex flex-col w-fit'
          href='/posts'
        >
          <div className="text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
            Haechan
          </div>
          <div className="text-xs text-gray-400 mt-1 font-light tracking-wide">DEV BLOG</div>
        </Link>
      </div>

      <div className='flex flex-col flex-1 overflow-y-auto'>
        {tagCount.map(([tag, count]) => {
          return (
            <div key={tag}>
              <Link
                href={!selectedSlug && selectedTag === tag ? '/posts' : `/posts?tag=${tag}`}
                className={clsx(
                  'flex items-start w-full py-3 px-9 hover:text-blue-500',
                  !selectedSlug && tag === selectedTag ? 'bg-blue-50 font-semibold text-blue-500' : 'text-gray-900'
                )}
              >
                <div className='text-sm mr-1'>{tag}</div>
                <div className='text-xs'>{count}</div>
              </Link>
              {tag === selectedTag && postsOfTag && (postsOfTag.map(post => (
                <Link
                  key={`${tag}-${post.slug} `}
                  href={`/posts/${post.slug}${selectedTag ? `?tag=${selectedTag}` : ''}`}
                  className={clsx(
                    'flex w-full py-3 pl-12 pr-9 hover:text-blue-500',
                    post.slug === selectedSlug ? 'bg-blue-50 font-semibold text-blue-500' : 'text-gray-900'
                  )}
                >
                  <div className='text-sm'>{post.title}</div>
                </Link>
              )))}
            </div>
          )
        })}
      </div>

      <div className="py-12 flex justify-center items-center gap-x-2">
        <a
          href='https://github.com/haechan29'
          target='_blank'
          rel='noopener noreferrer'
          className='w-10 h-10 flex justify-center items-center rounded-full hover:bg-blue-300 transition-colors duration-300 ease-in-out'>
          <Image
            width={20}
            height={20}
            src='/images/github.png'
            alt='github icon'
            className='rounded-full'
          />
        </a>
        <button className='w-10 h-10 flex justify-center items-center cursor-pointer rounded-full hover:bg-blue-300 transition-colors duration-300 ease-in-out'>
          <Mail className='w-5 h-5'/>
        </button>
        <button className='w-10 h-10 flex justify-center items-center cursor-pointer rounded-full hover:bg-blue-300 transition-colors duration-300 ease-in-out'>
          <FileUser className='w-5 h-5'/>
        </button>
      </div>
    </div>
  );
}