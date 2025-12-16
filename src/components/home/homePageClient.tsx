'use client';

import HomeSidebar from '@/components/home/homeSidebar';
import HomeToolbar from '@/components/home/homeToolbar';
import PostPreview from '@/components/post/postPreview';
import { PostProps } from '@/features/post/ui/postProps';
import clsx from 'clsx';
import { Suspense } from 'react';

export default function HomePageClient({
  isLoggedIn,
  posts,
  userId,
}: {
  isLoggedIn: boolean;
  posts: PostProps[];
  userId?: string;
}) {
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
          'mt-(--toolbar-height) mb-20 px-6 md:px-12 xl:px-18',
          'xl:ml-(--sidebar-width)',
          'xl:mr-[calc(var(--toc-width)+var(--toc-margin))]'
        )}
      >
        <div className='flex flex-col mt-8 mb-20'>
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
      </div>
    </>
  );
}
