'use client';

import HomeSidebar from '@/components/home/homeSidebar';
import HomeToolbar from '@/components/home/homeToolbar';
import PostPreview from '@/components/post/postPreview';
import ToolbarProfileIcon from '@/components/post/toolbarProfileIcon';
import SearchAutocomplete from '@/components/search/searchAutocomplete';
import * as PostClientService from '@/features/post/domain/service/postClientService';
import { createProps } from '@/features/post/ui/postProps';
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { ChevronLeft, Loader2, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function SearchPageClient({
  isLoggedIn,
  userId,
  query,
}: {
  isLoggedIn: boolean;
  userId?: string;
  query?: string;
}) {
  const [isSearching, setIsSearching] = useState(!query);

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['searchPosts', query],
    queryFn: () =>
      PostClientService.searchPosts(query!).then(posts =>
        posts.map(createProps)
      ),
    enabled: !!query,
  });

  if (isSearching) {
    return (
      <div className='md:hidden'>
        <SearchAutocomplete initialQuery={query} />
      </div>
    );
  }

  return (
    <>
      <div className='max-md:hidden'>
        <HomeToolbar isLoggedIn={isLoggedIn} initialQuery={query} />
      </div>

      <div className='md:hidden'>
        <SearchToolbarMobile
          query={query}
          onSearchClick={() => setIsSearching(true)}
          isLoggedIn={isLoggedIn}
        />
      </div>

      {userId && (
        <div className='max-xl:hidden'>
          <HomeSidebar userId={userId} />
        </div>
      )}

      <div
        className={clsx(
          'mt-(--toolbar-height) mb-8 px-6 md:px-12 xl:px-18',
          'xl:ml-(--sidebar-width)',
          'xl:mr-[calc(var(--toc-width)+var(--toc-margin))]'
        )}
      >
        {isLoading ? (
          <div className='flex justify-center py-8'>
            <Loader2 className='w-6 h-6 animate-spin text-gray-400' />
          </div>
        ) : posts.length === 0 ? (
          <div className='py-8 text-center text-gray-500'>
            검색 결과가 없습니다
          </div>
        ) : (
          <div className='flex flex-col mt-8'>
            {posts.map((post, index) => (
              <div key={post.id} className='mb-8'>
                <PostPreview
                  isLoggedIn={isLoggedIn}
                  post={post}
                  userId={userId}
                />
                {index !== posts.length - 1 && (
                  <div className='h-px bg-gray-200' />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

function SearchToolbarMobile({
  query,
  onSearchClick,
  isLoggedIn,
}: {
  query?: string;
  onSearchClick: () => void;
  isLoggedIn: boolean;
}) {
  const router = useRouter();

  return (
    <div className='fixed top-0 z-40 w-full flex items-center py-2 px-4 gap-2 bg-white/80 backdrop-blur-md'>
      <button onClick={() => router.back()} className='p-2 -my-2 -ml-4 -mr-2'>
        <ChevronLeft className='w-7 h-7 text-gray-500' />
      </button>

      <button
        onClick={onSearchClick}
        className='flex-1 flex items-center px-4 py-1 bg-gray-100 rounded-full mr-1'
      >
        <span className='flex-1 text-left truncate'>{query || '검색'}</span>
        <Search className='w-5 h-5 shrink-0' />
      </button>

      <ToolbarProfileIcon isLoggedIn={isLoggedIn} />
    </div>
  );
}
