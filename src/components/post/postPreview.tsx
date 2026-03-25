'use client';

import ProfileIcon from '@/components/user/profileIcon';
import { PostProps } from '@/features/post/ui/postProps';
import Link from 'next/link';
import { useState } from 'react';

import { LockIcon } from '@/components/lockIcon';
import PostSettingsDropdown from '@/components/post/postSettingsDropdown';
import PostVisibilityToggle from '@/components/post/postVisibilityToggle';
import Tooltip from '@/components/tooltip';
import clsx from 'clsx';
import { Link2, MoreVertical } from 'lucide-react';

const SCALE_ANIMATION_DELAY = 0.5;
const SCROLL_ANIMATION_DELAY = 1;
const MIN_TEXT_LENGTH_FOR_SCROLL_ANIMATION = 200;

export default function PostPreview({
  post,
  userId,
  skipPasswordInput = false,
  showSettings = false,
  isCreatorOwner = false,
  onDeleteSuccess,
  onVisibilitySuccess,
}: {
  post: PostProps;
  userId?: string;
  skipPasswordInput?: boolean;
  showSettings?: boolean;
  isCreatorOwner?: boolean;
  onDeleteSuccess?: () => void;
  onVisibilitySuccess?: () => void;
}) {
  const { id, title, preview, tags } = post;
  const isScrollAnimationEnabled =
    preview.length >= MIN_TEXT_LENGTH_FOR_SCROLL_ANIMATION;
  const [isHovered, setIsHovered] = useState(false);

  const areTagsVisible = tags.length > 0;

  return (
    <div
      className='relative flex flex-col mb-8'
      style={{
        '--scale-delay': `${SCALE_ANIMATION_DELAY}s`,
        '--scroll-delay': `${SCROLL_ANIMATION_DELAY}s`,
      }}
    >
      <div
        className={clsx(
          'absolute -inset-x-6 -inset-y-4 -z-50 rounded-xl bg-gray-100/50',
          'transition duration-300 ease-in-out origin-center',
          isHovered ? 'scale-100 opacity-100' : 'scale-90 opacity-0'
        )}
      />

      {showSettings && (
        <div className='absolute top-0 right-0 z-10 flex items-center gap-3'>
          {isCreatorOwner && (
            <PostVisibilityToggle
              postId={id}
              initialVisibility={post.visibility}
              onSuccess={onVisibilitySuccess}
            />
          )}

          {userId === post.userId && (
            <PostSettingsDropdown
              skipPasswordInput={skipPasswordInput}
              userId={userId}
              post={post}
              onDeleteSuccess={onDeleteSuccess}
            >
              <MoreVertical className='w-9 h-9 text-gray-400 hover:text-gray-500 hover:bg-gray-200 rounded-full p-2 -m-2 cursor-pointer' />
            </PostSettingsDropdown>
          )}
        </div>
      )}

      <div
        onMouseLeave={() => setIsHovered(false)}
        className='w-full flex flex-col gap-4'
      >
        <Link
          href={`/read/${id}?from=feed`}
          className='w-full flex flex-col gap-4 text-gray-900'
          onMouseEnter={() => setIsHovered(true)}
        >
          <div
            className={clsx(
              showSettings && isCreatorOwner
                ? 'w-[calc(100%-9rem)] sm:w-[calc(100%-10rem)]'
                : showSettings && post.userId === userId
                  ? 'w-[calc(100%-3rem)]'
                  : 'w-full',
              'flex items-start gap-2'
            )}
          >
            {!isCreatorOwner && post.visibility === 'private' && (
              <div className='shrink-0'>
                <Tooltip text='나만 볼 수 있습니다'>
                  <LockIcon className='w-6 h-6 opacity-70 mt-1' />
                </Tooltip>
              </div>
            )}

            {!isCreatorOwner && post.visibility === 'unlisted' && (
              <div className='shrink-0'>
                <Tooltip text='링크를 아는 사람만 볼 수 있습니다'>
                  <Link2 className='w-6 h-6 opacity-70 mt-1' />
                </Tooltip>
              </div>
            )}

            <div className='text-xl sm:text-2xl font-semibold line-clamp-2'>
              {title}
            </div>
          </div>

          <div className='whitespace-pre-wrap break-keep wrap-anywhere'>
            {isScrollAnimationEnabled ? (
              <div className='relative h-18'>
                <div
                  className={clsx(
                    'absolute inset-x-0 top-0 ease-in-out',
                    isHovered
                      ? 'h-(--extended-height) line-clamp-9999 duration-(--scale-delay) delay-(--scale-delay)'
                      : 'h-18 line-clamp-3 duration-300 delay-0'
                  )}
                  style={{
                    '--extended-height': areTagsVisible ? '9rem' : '7rem',
                  }}
                >
                  <div className={clsx(isHovered && 'hidden')}>{preview}</div>
                  <div
                    className={clsx(
                      'absolute inset-x-0 top-0',
                      'transition-transform ease-linear',
                      isHovered
                        ? 'text-gray-900 duration-(--scroll-duration) delay-(--scroll-delay) translate-y-[calc(-100%+9rem)]'
                        : 'text-transparent duration-[0] delay-0'
                    )}
                    style={{
                      '--scroll-duration': `${preview.length / 50}s`,
                    }}
                  >
                    {preview}
                  </div>
                </div>
              </div>
            ) : (
              <div className='max-h-18 overflow-hidden'>{preview}</div>
            )}
          </div>
        </Link>

        <div
          className={clsx(
            'flex flex-col gap-4',
            isScrollAnimationEnabled &&
              'transition-opacity duration-300 ease-in-out',
            isScrollAnimationEnabled &&
              (isHovered
                ? 'delay-(--scale-delay) opacity-0'
                : 'delay-0 opacity-100')
          )}
        >
          {areTagsVisible && (
            <div className='w-full flex overflow-x-auto scrollbar-hide gap-3'>
              {tags.map(tag => (
                <Link
                  key={tag}
                  href={`/tag/${encodeURIComponent(tag)}`}
                  className={clsx(
                    'text-xs px-2 py-1 border border-gray-300 rounded-full whitespace-nowrap active:scale-[0.98]',
                    'text-gray-700 cursor-pointer transition-colors',
                    'hover:text-gray-900 hover:bg-gray-100/80'
                  )}
                >
                  {tag}
                </Link>
              ))}
            </div>
          )}

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
            {post.viewCount !== null && (
              <>
                <Divider />
                <div className='text-gray-500'>{`조회 ${post.viewCount}`}</div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Divider() {
  return <div className='w-[3px] h-[3px] rounded-full bg-gray-400' />;
}
