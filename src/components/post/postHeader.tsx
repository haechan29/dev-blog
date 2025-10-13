'use client';

import useHeaderTracker from '@/features/post/hooks/useHeaderTracker';
import { PostProps } from '@/features/post/ui/postProps';
import { fetchPostStat } from '@/features/postStat/domain/service/postStatService';
import { useQuery } from '@tanstack/react-query';
import { Heart } from 'lucide-react';
import Link from 'next/link';
import { useRef } from 'react';

export default function PostHeader({ post }: { post: PostProps }) {
  const { data: stat } = useQuery({
    queryKey: ['posts', post.slug, 'stats'],
    queryFn: () => fetchPostStat(post.slug).then(stat => stat.toProps()),
  });

  const headerRef = useRef(null);
  useHeaderTracker(headerRef);

  return (
    <div ref={headerRef} className='mb-10'>
      <Title {...post} />
      <Tags {...post} />
      <Info {...post} {...stat} />
    </div>
  );
}

function Title({ title }: { title: string }) {
  return <div className='text-3xl font-bold mb-6'>{title}</div>;
}

function Tags({ tags }: { tags: string[] }) {
  return (
    <div className='flex flex-wrap gap-3 mb-6'>
      {tags.map(tag => (
        <Link
          key={tag}
          href={`/posts?tag=${tag}`}
          className='text-xs px-2 py-1 border border-gray-300 rounded-full hover:text-blue-500 hover:border-blue-200'
        >
          {tag}
        </Link>
      ))}
    </div>
  );
}

function Info({
  date,
  likeCount = 0,
  viewCount = 0,
}: {
  date: string;
  likeCount?: number;
  viewCount?: number;
}) {
  return (
    <div className='flex gap-4 items-center text-xs text-gray-500'>
      <div>{date}</div>
      <div className='flex items-center gap-1'>
        <Heart className='w-3 h-3 fill-gray-500' />
        <span>{likeCount}</span>
      </div>
      <div>{`조회 ${viewCount}`}</div>
    </div>
  );
}
