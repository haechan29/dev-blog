export const dynamic = 'force-dynamic';

import { auth } from '@/auth';
import HomeToolbar from '@/components/home/homeToolbar';
import PostPreview from '@/components/post/postPreview';
import * as PostServerService from '@/features/post/domain/service/postServerService';
import { createProps } from '@/features/post/ui/postProps';
import clsx from 'clsx';
import { cookies } from 'next/headers';
import { Suspense } from 'react';

export default async function HomePage() {
  const session = await auth();
  const userId =
    session?.user?.user_id ?? (await cookies()).get('userId')?.value;

  const posts = await PostServerService.fetchPosts().then(posts =>
    posts.map(createProps)
  );

  return (
    <>
      <Suspense>
        <HomeToolbar isLoggedIn={!!session} />
      </Suspense>

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
              <PostPreview post={post} />
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
