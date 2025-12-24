'use client';

import * as PostClientService from '@/features/post/domain/service/postClientService';
import { createProps } from '@/features/post/ui/postProps';
import useDebounce from '@/hooks/useDebounce';
import useMediaQuery, { TOUCH_QUERY } from '@/hooks/useMediaQuery';
import useRouterWithProgress from '@/hooks/useRouterWithProgress';
import { createRipple } from '@/lib/dom';
import { postKeys } from '@/queries/keys';
import { useQuery } from '@tanstack/react-query';
import { ArrowUpRight, ChevronLeft, Loader2, Search } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function SearchPageClient({
  initialQuery,
}: {
  initialQuery?: string;
}) {
  const router = useRouterWithProgress();
  const debounce = useDebounce();

  const isTouch = useMediaQuery(TOUCH_QUERY);
  const [query, setQuery] = useState(initialQuery ?? '');
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  const { data: posts = [], isLoading } = useQuery({
    queryKey: postKeys.search(debouncedQuery, 10),
    queryFn: () =>
      PostClientService.searchPosts(debouncedQuery, 10).then(result =>
        result.posts.map(createProps)
      ),
    enabled: debouncedQuery.length > 0,
  });

  useEffect(() => {
    if (isTouch === false) {
      if (initialQuery?.trim()) {
        router.replace(`/search/result?q=${encodeURIComponent(initialQuery)}`);
      } else {
        router.back();
      }
    }
  }, [initialQuery, isTouch, router]);

  useEffect(() => {
    debounce(() => setDebouncedQuery(query), 300);
  }, [query, debounce]);

  return (
    <div className='min-h-screen bg-white'>
      <div className='sticky top-0 z-10 px-4 md:px-6 py-2 md:py-3'>
        <div className='flex items-center gap-2'>
          <button
            onClick={() => router.back()}
            className='p-2 -my-2 -ml-4 -mr-2'
            aria-label='뒤로가기'
          >
            <ChevronLeft className='w-7 h-7 text-gray-500' />
          </button>

          <div className='flex-1 flex items-center gap-2 px-4 py-1 bg-gray-100 rounded-full'>
            <input
              type='text'
              inputMode='search'
              placeholder='검색'
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && query.trim()) {
                  router.push(
                    `/search/result?q=${encodeURIComponent(query.trim())}`
                  );
                }
              }}
              autoFocus
              className='flex-1 bg-transparent outline-none'
            />
            <button
              className='p-2 -m-2 rounded-full'
              onClick={e => {
                createRipple(e);

                if (query.trim()) {
                  router.push(
                    `/search/result?q=${encodeURIComponent(query.trim())}`
                  );
                }
              }}
            >
              <Search className='w-5 h-5 shrink-0' />
            </button>
          </div>
        </div>
      </div>

      {debouncedQuery.length > 0 && (
        <div className='px-6 md:px-12 py-2'>
          {isLoading ? (
            <div className='py-8 flex justify-center'>
              <Loader2 className='w-6 h-6 animate-spin text-gray-400' />
            </div>
          ) : (
            posts.length > 0 && (
              <ul>
                {posts.map(post => (
                  <li key={post.id}>
                    <Link
                      href={`/read/${post.id}`}
                      className='flex justify-between items-center py-3'
                    >
                      <span className='line-clamp-1'>{post.title}</span>
                      <ArrowUpRight className='w-4 h-4 shrink-0 text-gray-400' />
                    </Link>
                  </li>
                ))}
              </ul>
            )
          )}
        </div>
      )}
    </div>
  );
}
