'use client';

import PostSidebarFooterSection from '@/components/post/postSidebarFooterSection';
import useSidebar from '@/features/post/hooks/useSidebar';
import useSidebarSwipe from '@/features/post/hooks/useSidebarSwipe';
import { PostProps } from '@/features/post/ui/postProps';
import { setIsVisible } from '@/lib/redux/postSidebarSlice';
import { AppDispatch } from '@/lib/redux/store';
import clsx from 'clsx';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useDispatch } from 'react-redux';

export default function PostSidebar({ posts }: { posts: PostProps[] }) {
  const params = useParams();
  const selectedSlug = params.slug as string | undefined;

  const dispatch = useDispatch<AppDispatch>();

  const { selectedTag, tagCount, postsOfTag, isVisible } = useSidebar({
    posts,
  });

  const swipeHandlers = useSidebarSwipe();

  return (
    <div
      {...swipeHandlers}
      className={clsx(
        'fixed z-50 left-0 top-0 bottom-0 w-72 transition-transform duration-300 ease-in-out',
        !isVisible && '-translate-x-full'
      )}
    >
      <div className='flex flex-col w-full min-w-0 h-dvh bg-[#fafbfc] border-r border-r-gray-50'>
        <div className='flex w-full min-w-0 px-6 py-9'>
          <Link
            onClick={() => dispatch(setIsVisible(false))}
            className='flex flex-col min-w-0 px-3 py-3'
            href='/posts'
          >
            <div className='text-2xl font-bold tracking-tight text-blue-500'>
              Haechan
            </div>
            <div className='text-xs text-gray-400 mt-1 font-light tracking-wide'>
              DEV BLOG
            </div>
          </Link>
        </div>

        <div className='flex flex-col flex-1 overflow-y-auto'>
          {tagCount.map(([tag, count]) => {
            return (
              <div key={tag}>
                <Link
                  href={
                    !selectedSlug && selectedTag === tag
                      ? '/posts'
                      : `/posts?tag=${tag}`
                  }
                  className={clsx(
                    'flex items-center w-full py-3 px-9 gap-2 hover:text-blue-500',
                    !selectedSlug && selectedTag === tag
                      ? 'bg-blue-50 font-semibold text-blue-500'
                      : 'text-gray-900'
                  )}
                >
                  <div className='flex-1 text-sm'>{tag}</div>
                  {selectedTag !== tag && (
                    <div className='flex-shrink-0 text-xs text-gray-400'>
                      {count}
                    </div>
                  )}
                </Link>
                {selectedTag === tag &&
                  postsOfTag !== null &&
                  postsOfTag.map(post => (
                    <Link
                      key={`${tag}-${post.slug} `}
                      href={`/posts/${post.slug}${
                        selectedTag ? `?tag=${selectedTag}` : ''
                      }`}
                      onClick={() => dispatch(setIsVisible(false))}
                      className={clsx(
                        'flex w-full py-3 pl-12 pr-9 hover:text-blue-500',
                        post.slug === selectedSlug
                          ? 'bg-blue-50 font-semibold text-blue-500'
                          : 'text-gray-900'
                      )}
                    >
                      <div className='text-sm'>{post.title}</div>
                    </Link>
                  ))}
              </div>
            );
          })}
        </div>

        <PostSidebarFooterSection />
      </div>
    </div>
  );
}
