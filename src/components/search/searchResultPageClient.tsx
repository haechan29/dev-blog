'use client';

import HomeSidebar from '@/components/home/homeSidebar';
import HomeToolbar from '@/components/home/homeToolbar';
import PostPreview from '@/components/post/postPreview';
import ToolbarProfileIcon from '@/components/post/toolbarProfileIcon';
import * as PostClientService from '@/features/post/domain/service/postClientService';
import { createProps, PostProps } from '@/features/post/ui/postProps';
import useRouterWithProgress from '@/hooks/useRouterWithProgress';
import { postsKeys } from '@/queries/keys';
import { useInfiniteQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { ChevronLeft, Loader2, Search } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useMemo } from 'react';
import { useInView } from 'react-intersection-observer';

export default function SearchResultPageClient({
  isLoggedIn,
  query,
  initialPosts,
  initialCursor,
  userId,
}: {
  isLoggedIn: boolean;
  query: string;
  initialPosts: PostProps[];
  initialCursor: { score: number; id: string } | null;
  userId?: string;
}) {
  const { ref, inView } = useInView();

  const {
    data: { pages },
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: postsKeys.search(query, 20, true),
    queryFn: async ({ pageParam }) => {
      const result = await PostClientService.searchPosts(
        query,
        20,
        pageParam?.score,
        pageParam?.id
      );
      return {
        posts: result.posts.map(createProps),
        nextCursor: result.nextCursor,
      };
    },
    initialPageParam: null as { score: number; id: string } | null,
    getNextPageParam: lastPage => lastPage.nextCursor,
    initialData: {
      pages: [{ posts: initialPosts, nextCursor: initialCursor }],
      pageParams: [null],
    },
  });

  const posts = useMemo(() => pages.flatMap(page => page.posts) ?? [], [pages]);

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, inView, isFetchingNextPage]);

  return (
    <>
      <div className='max-md:hidden'>
        <HomeToolbar isLoggedIn={isLoggedIn} initialQuery={query} />
      </div>

      <div className='md:hidden'>
        <SearchToolbarMobile query={query} isLoggedIn={isLoggedIn} />
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
        {posts.length > 0 && (
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

            <div ref={ref} />
            {isFetchingNextPage && (
              <div className='flex justify-center py-4'>
                <Loader2
                  strokeWidth={3}
                  className='animate-spin text-gray-400'
                />
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

function SearchToolbarMobile({
  query,
  isLoggedIn,
}: {
  query: string;
  isLoggedIn: boolean;
}) {
  const router = useRouterWithProgress();

  return (
    <div className='fixed top-0 z-40 w-full flex items-center py-2 px-4 gap-2 bg-white/80 backdrop-blur-md'>
      <button onClick={() => router.back()} className='p-2 -my-2 -ml-4 -mr-2'>
        <ChevronLeft className='w-7 h-7 text-gray-500' />
      </button>

      <Link
        href={`/search?q=${encodeURIComponent(query)}`}
        className='flex-1 flex items-center px-4 py-1 bg-gray-100 rounded-full mr-1'
      >
        <span className='flex-1 text-left truncate'>{query}</span>
        <Search className='w-5 h-5 shrink-0' />
      </Link>

      <ToolbarProfileIcon isLoggedIn={isLoggedIn} />
    </div>
  );
}
