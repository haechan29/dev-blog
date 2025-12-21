'use client';

import HomeSidebar from '@/components/home/homeSidebar';
import HomeToolbar from '@/components/home/homeToolbar';
import PostPreview from '@/components/post/postPreview';
import * as PostClientService from '@/features/post/domain/service/postClientService';
import { createProps, PostProps } from '@/features/post/ui/postProps';
import { postsKeys } from '@/queries/keys';
import { useInfiniteQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { Loader2 } from 'lucide-react';
import { Suspense, useEffect, useMemo } from 'react';
import { useInView } from 'react-intersection-observer';

export default function HomePageClient({
  isLoggedIn,
  initialPosts,
  initialCursor,
  userId,
}: {
  isLoggedIn: boolean;
  initialPosts: PostProps[];
  initialCursor: string | null;
  userId?: string;
}) {
  const { ref, inView } = useInView();

  const {
    data: { pages },
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: postsKeys.list(),
    queryFn: async ({ pageParam }) => {
      const result = await PostClientService.getFeedPosts(pageParam);
      return {
        posts: result.posts.map(createProps),
        nextCursor: result.nextCursor,
      };
    },
    initialPageParam: null as string | null,
    getNextPageParam: lastPage => lastPage.nextCursor,
    initialData: {
      pages: [{ posts: initialPosts, nextCursor: initialCursor }],
      pageParams: [null],
    },
  });

  const posts = useMemo(() => pages.flatMap(page => page.posts), [pages]);

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <>
      <Suspense>
        <HomeToolbar isLoggedIn={isLoggedIn} />
      </Suspense>

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
              <Loader2 strokeWidth={3} className='animate-spin text-gray-400' />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
