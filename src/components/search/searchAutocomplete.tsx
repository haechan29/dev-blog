'use client';

import * as PostClientService from '@/features/post/domain/service/postClientService';
import { createProps } from '@/features/post/ui/postProps';
import useDebounce from '@/hooks/useDebounce';
import { createRipple } from '@/lib/dom';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, Loader2, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function SearchAutocomplete() {
  const router = useRouter();
  const debounce = useDebounce();

  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['searchPosts', debouncedQuery],
    queryFn: () =>
      PostClientService.searchPosts(debouncedQuery).then(posts =>
        posts.map(createProps)
      ),
    enabled: debouncedQuery.length > 0,
  });

  useEffect(() => {
    debounce(() => setDebouncedQuery(query), 300);
  }, [query, debounce]);

  return (
    <div className='min-h-screen bg-white'>
      <div className='sticky top-0 z-10 px-4 py-2'>
        <div className='flex items-center gap-2'>
          <button
            onClick={() => router.back()}
            className='p-2 -my-2 -ml-4 -mr-2'
            aria-label='뒤로가기'
          >
            <ChevronLeft className='w-7 h-7 text-gray-500' />
          </button>
          <div className='flex-1 flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full'>
            <input
              type='text'
              inputMode='search'
              placeholder='검색'
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && query.trim()) {
                  router.push(`/search?q=${encodeURIComponent(query.trim())}`);
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
                  router.push(`/search?q=${encodeURIComponent(query.trim())}`);
                }
              }}
            >
              <Search className='w-5 h-5 shrink-0' />
            </button>
          </div>
        </div>
      </div>

      {debouncedQuery.length > 0 && (
        <div className='px-4 py-2'>
          {isLoading ? (
            <div className='py-8 flex justify-center'>
              <Loader2 className='w-6 h-6 animate-spin text-gray-400' />
            </div>
          ) : posts.length === 0 ? (
            <div className='py-8 text-center text-gray-500 text-sm'>
              검색 결과가 없습니다
            </div>
          ) : (
            <ul>
              {posts.map(post => (
                <li
                  key={post.id}
                  onClick={() => router.push(`/read/${post.id}`)}
                  className='py-3 border-b border-gray-100 cursor-pointer'
                >
                  <div className='font-medium'>{post.title}</div>
                  <div className='text-xs text-gray-500 mt-1'>
                    {post.authorName} · {post.createdAt}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
