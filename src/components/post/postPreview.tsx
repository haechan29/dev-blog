import PostInfo from '@/components/post/postInfo';
import { PostProps } from '@/features/post/ui/postProps';
import clsx from 'clsx';
import Link from 'next/link';

const SCALE_ANIMATION_DELAY = 0.5;
const SCROLL_ANIMATION_DELAY = 1;
const MIN_TEXT_LENGTH_FOR_SCROLL_ANIMATION = 200;

export default function PostPreview({
  tag,
  post,
}: {
  tag: string | null;
  post: PostProps;
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

      <Link
        href={`/posts/${id}${tag ? `?tag=${tag}` : ''}`}
        className='w-full flex flex-col gap-4 text-gray-900'
      >
        <div className='text-2xl font-semibold line-clamp-2'>{title}</div>
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

          <PostInfo {...post} />
        </div>
      </Link>
    </div>
  );
}
