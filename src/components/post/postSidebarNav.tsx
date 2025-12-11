'use client';

import { PostProps } from '@/features/post/ui/postProps';
import clsx from 'clsx';
import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';

export default function PostSidebarNav({
  currentPostId,
  posts,
}: {
  currentPostId: string;
  posts: PostProps[];
}) {
  const seriesMap = useMemo(() => {
    const map = new Map<string, PostProps[]>();
    const sortedPosts = [...posts].sort(
      (a, b) => (a.seriesOrder ?? 0) - (b.seriesOrder ?? 0)
    );
    sortedPosts.forEach(post => {
      if (!post.seriesId) return;
      const existing = map.get(post.seriesId);
      if (existing) {
        existing.push(post);
      } else {
        map.set(post.seriesId, [post]);
      }
    });
    return map;
  }, [posts]);

  const seriesList = useMemo(
    () => Array.from(seriesMap.entries()),
    [seriesMap]
  );

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
      {seriesList.map(([seriesId, seriesPosts]) => (
        <div key={seriesId}>
          <NavCategory
            posts={seriesPosts}
            isActive={
              !openSeriesIds.has(seriesId) && currentSeriesId === seriesId
            }
            onToggle={() => toggleSeries(seriesId)}
          />
          {openSeriesIds.has(seriesId) && (
            <NavPostList posts={seriesPosts} currentPostId={currentPostId} />
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
  posts,
  isActive,
  onToggle,
}: {
  posts: PostProps[];
  isActive: boolean;
  onToggle: () => void;
}) {
  return (
    posts.length > 0 && (
      <div
        onClick={onToggle}
        className={clsx(
          'flex items-center w-full p-3 gap-2 rounded-sm hover:text-blue-500 cursor-pointer',
          isActive ? 'bg-blue-50 font-semibold text-blue-500' : 'text-gray-900'
        )}
      >
        <div className='flex-1 text-sm'>{posts[0].seriesTitle}</div>
        <div className='shrink-0 text-xs text-gray-400'>{posts.length}</div>
      </div>
    )
  );
}

function NavPostList({
  posts,
  currentPostId,
}: {
  posts: PostProps[];
  currentPostId: string;
}) {
  return posts.map(post => (
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
