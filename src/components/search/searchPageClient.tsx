'use client';

import * as PostClientService from '@/features/post/domain/service/postClientService';
import { createProps } from '@/features/post/ui/postProps';
import * as TagClientRepository from '@/features/tag/data/repository/tagClientRepository';
import useDebounce from '@/hooks/useDebounce';
import useMediaQuery, { MD_QUERY, TOUCH_QUERY } from '@/hooks/useMediaQuery';
import useRouterWithProgress from '@/hooks/useRouterWithProgress';
import { createRipple } from '@/lib/dom';
import { postKeys, tagKeys } from '@/queries/keys';
import { useQuery } from '@tanstack/react-query';
import { ArrowUpRight, ChevronLeft, Hash, Loader2, Search } from 'lucide-react';
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
  const isLargerThanMd = useMediaQuery(MD_QUERY);
  const [query, setQuery] = useState(initialQuery ?? '');
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  const isTagSearch = debouncedQuery.startsWith('#');
  const postQuery = isTagSearch ? '' : debouncedQuery.trim();
  const tagQuery = isTagSearch ? debouncedQuery.slice(1).trim() : '';

  const isPostSearchEnabled = !isTagSearch && postQuery.length > 0;
  const isTagSearchEnabled = isTagSearch && tagQuery.length > 0;

  const { data: posts = [], isLoading: isPostsLoading } = useQuery({
    queryKey: postKeys.search(postQuery),
    queryFn: () =>
      PostClientService.searchPosts({ query: postQuery }).then(result =>
        result.posts.map(createProps)
      ),
    enabled: isPostSearchEnabled,
  });

  const { data: tags = [], isLoading: isTagsLoading } = useQuery({
    queryKey: tagKeys.search(tagQuery),
    queryFn: () => TagClientRepository.getTagNames({ query: tagQuery }),
    enabled: isTagSearchEnabled,
  });

  const navigateFromSearchInput = () => {
    const isTagSearch = query.startsWith('#');
    const postQuery = isTagSearch ? '' : query.trim();
    const tagQuery = isTagSearch ? query.slice(1).trim() : '';

    if (postQuery) {
      router.push(`/search/result?q=${encodeURIComponent(postQuery)}`);
    } else if (tagQuery) {
      router.push(`/tag/${encodeURIComponent(tagQuery)}`);
    }
  };

  const isLoading =
    (!isTagSearch && isPostsLoading) || (isTagSearch && isTagsLoading);
  const isEmpty =
    (!isTagSearch && posts.length === 0) || (isTagSearch && tags.length === 0);
  const shouldShowDropdown = query.length > 0;
  const isTagOnly = query === '#';

  useEffect(() => {
    if (isTouch === false && isLargerThanMd === true) {
      if (initialQuery?.trim()) {
        router.replace(`/search/result?q=${encodeURIComponent(initialQuery)}`);
      } else {
        router.back();
      }
    }
  }, [initialQuery, isLargerThanMd, isTouch, router]);

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
                if (e.nativeEvent.isComposing) return;
                if (e.key === 'Enter') {
                  navigateFromSearchInput();
                }
              }}
              autoFocus
              className='flex-1 bg-transparent outline-none'
            />
            <button
              className='p-2 -m-2 rounded-full'
              onClick={e => {
                createRipple(e);
                navigateFromSearchInput();
              }}
            >
              <Search className='w-5 h-5 shrink-0' />
            </button>
          </div>
        </div>
      </div>

      {shouldShowDropdown && (
        <div className='px-6 md:px-12 py-2'>
          {isTagOnly ? (
            <div className='flex justify-center py-4 text-gray-400'>
              태그를 입력해주세요
            </div>
          ) : isLoading ? (
            <div className='flex justify-center py-4'>
              <Loader2 className='w-6 h-6 animate-spin text-gray-400' />
            </div>
          ) : isEmpty ? (
            <div className='flex justify-center py-4 text-gray-400'>
              검색 결과가 없습니다
            </div>
          ) : (
            <>
              {!isTagSearch && (
                <ul>
                  {posts.map(post => (
                    <li key={post.id}>
                      <Link
                        href={`/read/${post.id}`}
                        className='flex justify-between items-center gap-2 py-3'
                      >
                        <div className='flex items-center gap-2 min-w-0 flex-1'>
                          <Search
                            className='w-4 h-4 shrink-0 text-gray-400'
                            aria-hidden
                          />
                          <span className='line-clamp-1'>{post.title}</span>
                        </div>
                        <ArrowUpRight className='w-4 h-4 shrink-0 text-gray-400' />
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
              {isTagSearch && (
                <ul>
                  {tags.map(tag => (
                    <li key={tag}>
                      <Link
                        href={`/tag/${encodeURIComponent(tag)}`}
                        className='flex justify-between items-center gap-2 py-3'
                      >
                        <div className='flex items-center gap-2 min-w-0 flex-1'>
                          <Hash
                            className='w-4 h-4 shrink-0 text-gray-400'
                            aria-hidden
                          />
                          <span className='line-clamp-1'>{tag}</span>
                        </div>
                        <ArrowUpRight className='w-4 h-4 shrink-0 text-gray-400' />
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
