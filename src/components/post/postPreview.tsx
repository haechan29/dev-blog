'use client';

import ProfileIcon from '@/components/user/profileIcon';
import { PostProps } from '@/features/post/ui/postProps';
import Link from 'next/link';

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
  const { id, title, plainText, tags } = post;
  const isScrollAnimationEnabled =
    plainText.length >= MIN_TEXT_LENGTH_FOR_SCROLL_ANIMATION;

  return (
    <div
      className='relative flex flex-col group mb-8'
      style={{
        '--scale-delay': `${SCALE_ANIMATION_DELAY}s`,
        '--scroll-delay': `${SCROLL_ANIMATION_DELAY}s`,
      }}
    >
      <div
        className={clsx(
          'absolute -inset-x-6 -inset-y-4 -z-50 rounded-xl bg-gray-100/50',
          'transition-opacity|transform duration-300 ease-in-out',
          'scale-90 group-hover:scale-100 origin-center',
          'opacity-0 group-hover:opacity-100'
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
          <PostSettingsDropdown
            skipPasswordInput={skipPasswordInput}
            userId={userId}
            post={post}
            showRawContent={false}
            onDeleteSuccess={onDeleteSuccess}
          >
            <MoreVertical className='w-9 h-9 text-gray-400 hover:text-gray-500 hover:bg-gray-200 rounded-full p-2 -m-2 cursor-pointer' />
          </PostSettingsDropdown>
        </div>
      )}

      <div className='w-full flex flex-col gap-4'>
        <Link
          href={`/read/${id}?from=feed`}
          className='w-full flex flex-col gap-4 text-gray-900'
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
                    'absolute inset-x-0 top-0',
                    'h-18 line-clamp-3 group-hover:h-(--extended-height) group-hover:line-clamp-9999',
                    'transition-discrete ease-in-out duration-300 group-hover:duration-(--scale-delay)',
                    'delay-0 group-hover:delay-(--scale-delay)'
                  )}
                  style={{
                    '--extended-height': tags.length > 0 ? '9rem' : '7rem',
                  }}
                >
                  <div className='group-hover:hidden'>{plainText}</div>
                  <div
                    className={clsx(
                      'text-transparent group-hover:text-gray-900 absolute inset-x-0 top-0',
                      'transition-transform ease-linear duration-[0] group-hover:duration-(--scroll-duration)',
                      'delay-0 group-hover:delay-(--scroll-delay) group-hover:translate-y-[calc(-100%+9rem)]'
                    )}
                    style={{
                      '--scroll-duration': `${plainText.length / 50}s`,
                    }}
                  >
                    {plainText}
                  </div>
                </div>
              </div>
            ) : (
              <div className='max-h-18 overflow-hidden'>{plainText}</div>
            )}
          </div>
        </Link>

        <div
          className={clsx(
            'flex flex-col gap-4',
            isScrollAnimationEnabled &&
              'transition-opacity duration-300 ease-in-out delay-0 group-hover:delay-(--scale-delay) group-hover:opacity-0'
          )}
        >
          {tags.length > 0 && (
            <div className='w-full flex overflow-x-auto scrollbar-hide gap-2'>
              {tags.map((tag, index) => (
                <div
                  key={tag}
                  className={clsx(
                    'text-xs px-2 py-1 border border-gray-300 rounded-full whitespace-nowrap',
                    index >= 3 && 'max-w-20 text-ellipsis overflow-clip'
                  )}
                >
                  {tag}
                </div>
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
            <Divider />
            <div className='text-gray-500'>{`조회 ${post.viewCount}`}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Divider() {
  return <div className='w-[3px] h-[3px] rounded-full bg-gray-400' />;
}
