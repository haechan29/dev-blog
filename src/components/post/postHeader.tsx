'use client';

import PostSettingsDropdown from '@/components/post/postSettingsDropdown';
import ProfileIcon from '@/components/user/profileIcon';
import { PostProps } from '@/features/post/ui/postProps';
import useRouterWithProgress from '@/hooks/useRouterWithProgress';
import { setIsVisible } from '@/lib/redux/post/postSidebarSlice';
import { AppDispatch } from '@/lib/redux/store';
import clsx from 'clsx';
import { MoreVertical } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';

export default function PostHeader({
  userId,
  post,
  skipPasswordInput,
  onVisibilityChange,
}: {
  userId?: string;
  post: PostProps;
  skipPasswordInput: boolean;
  onVisibilityChange?: (isVisible: boolean) => void;
}) {
  const router = useRouterWithProgress();
  const dispatch = useDispatch<AppDispatch>();
  const { title, tags } = post;
  const headerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!headerRef.current || !onVisibilityChange) return;

    const headerObserver = new IntersectionObserver(
      entries => {
        const isVisible = entries[0]?.isIntersecting ?? false;
        onVisibilityChange(isVisible);
      },
      {
        rootMargin: '0px 0px -50% 0px',
      }
    );

    headerObserver.observe(headerRef.current);

    return () => headerObserver.disconnect();
  }, [onVisibilityChange]);

  return (
    <div ref={headerRef} className='flex flex-col gap-6 mb-10'>
      <div className='flex flex-col gap-2 items-start'>
        {post.seriesTitle && post.seriesOrder !== null && (
          <button
            onClick={() => {
              dispatch(setIsVisible(true));
            }}
            className={clsx(
              'text-sm text-gray-500  p-1 -m-1',
              'max-xl:hover:text-blue-600 max-xl:cursor-pointer',
              'xl:pointer-events-none'
            )}
          >
            {post.seriesTitle} · {post.seriesOrder + 1}편
          </button>
        )}
        <div className='text-3xl font-bold line-clamp-2'>{title}</div>
      </div>

      {tags.length > 0 && (
        <div className='w-full flex overflow-x-auto scrollbar-hide gap-3'>
          {tags.map(tag => (
            <div
              key={tag}
              className='text-xs px-2 py-1 border border-gray-300 rounded-full whitespace-nowrap'
            >
              {tag}
            </div>
          ))}
        </div>
      )}

      <div className='flex justify-between items-center'>
        <div className='flex gap-2 items-center text-xs'>
          <ProfileIcon
            nickname={post.authorName}
            size='sm'
            profileImageUrl={post.profileImageUrl}
          />
          <Link
            href={`/@${post.userId}/posts`}
            className='text-gray-900 hover:underline'
          >
            {post.authorName}
          </Link>
          <Divider />
          <div className='text-gray-500'>{post.createdAt}</div>
        </div>

        {post.userId === userId ? (
          <PostSettingsDropdown
            skipPasswordInput={skipPasswordInput}
            userId={userId}
            post={post}
            onDeleteSuccess={() => router.push('/')}
          >
            <MoreVertical className='w-9 h-9 text-gray-400 hover:text-gray-500 rounded-full p-2 -m-2 cursor-pointer' />
          </PostSettingsDropdown>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}

function Divider() {
  return <div className='w-[3px] h-[3px] rounded-full bg-gray-400' />;
}
