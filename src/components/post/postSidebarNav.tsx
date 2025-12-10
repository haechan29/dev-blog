'use client';

import { PostProps } from '@/features/post/ui/postProps';
import { SeriesProps } from '@/features/series/ui/seriesProps';
import clsx from 'clsx';
import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';

export default function PostSidebarNav({
  currentPostId,
  posts,
  seriesList,
}: {
  currentPostId: string;
  posts: PostProps[];
  seriesList: SeriesProps[];
}) {
  const currentSeriesId = useMemo(() => {
    const currentPost = posts.find(post => post.id === currentPostId);
    return currentPost?.seriesId ?? null;
  }, [currentPostId, posts]);

  const [openSeriesIds, setOpenSeriesIds] = useState<Set<string>>(
    new Set(currentSeriesId ? [currentSeriesId] : [])
  );

  const noSeriesPosts = useMemo(() => {
    return posts.filter(post => post.seriesId === null);
  }, [posts]);

  const toggleSeries = useCallback((id: string) => {
    setOpenSeriesIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  useEffect(() => {
    if (currentSeriesId) {
      setOpenSeriesIds(prev => new Set(prev).add(currentSeriesId));
    }
  }, [currentSeriesId]);

  return (
    <div className='flex flex-col flex-1 overflow-y-auto'>
      {seriesList.map(series => (
        <div key={series.id}>
          <NavCategory
            series={series}
            isActive={
              !openSeriesIds.has(series.id) && currentSeriesId === series.id
            }
            onToggle={() => toggleSeries(series.id)}
          />
          {openSeriesIds.has(series.id) && (
            <NavPostList series={series} currentPostId={currentPostId} />
          )}
        </div>
      ))}

      {noSeriesPosts.map(post => (
        <Link
          key={post.id}
          href={`/read/${post.id}`}
          className={clsx(
            'flex w-full py-3 pl-3 pr-3 rounded-sm hover:text-blue-500',
            post.id === currentPostId
              ? 'bg-blue-50 font-semibold text-blue-500'
              : 'text-gray-900'
          )}
        >
          <div className='text-sm'>{post.title}</div>
        </Link>
      ))}
    </div>
  );
}

function NavCategory({
  series,
  isActive,
  onToggle,
}: {
  series: SeriesProps;
  isActive: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      onClick={onToggle}
      className={clsx(
        'flex items-center w-full p-3 gap-2 rounded-sm hover:text-blue-500 cursor-pointer',
        isActive ? 'bg-blue-50 font-semibold text-blue-500' : 'text-gray-900'
      )}
    >
      <div className='flex-1 text-sm'>{series.title}</div>
      <div className='shrink-0 text-xs text-gray-400'>{series.postCount}</div>
    </div>
  );
}

function NavPostList({
  series,
  currentPostId,
}: {
  series: SeriesProps;
  currentPostId: string;
}) {
  const sortedPosts = useMemo(() => {
    return [...series.posts].sort(
      (a, b) => (a.seriesOrder ?? 0) - (b.seriesOrder ?? 0)
    );
  }, [series.posts]);

  return sortedPosts.map(post => (
    <Link
      key={post.id}
      href={`/read/${post.id}`}
      className={clsx(
        'flex w-full py-3 pl-6 pr-3 rounded-sm hover:text-blue-500',
        post.id === currentPostId
          ? 'bg-blue-50 font-semibold text-blue-500'
          : 'text-gray-900'
      )}
    >
      <div className='text-sm'>{post.title}</div>
    </Link>
  ));
}
