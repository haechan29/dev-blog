import PostInfo from '@/components/post/postInfo';
import { PostProps } from '@/features/post/ui/postProps';
import clsx from 'clsx';
import Link from 'next/link';

const SCALE_ANIMATION_DELAY = 0.5;
const SCROLL_ANIMATION_DELAY = 1;
const MIN_TEXT_LENGTH_FOR_SCROLL_ANIMATION = 200;

export default function PostPreview({
  tag,
  post: { id, title, plainText, tags, createdAt },
}: {
  tag: string | null;
  post: PostProps;
}) {
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
        className='w-full text-gray-900'
      >
        <div className='text-2xl font-semibold mb-4 line-clamp-2'>{title}</div>
        <div className='mb-4 whitespace-pre-line'>
          {isScrollAnimationEnabled ? (
            <div className='relative h-18'>
              <div
                className={clsx(
                  'absolute inset-x-0 top-0',
                  'h-18 line-clamp-3 group-hover:h-36 group-hover:line-clamp-[9999]',
                  'transition-discrete ease-in-out duration-300 group-hover:duration-[var(--scale-delay)]',
                  'delay-0 group-hover:delay-[var(--scale-delay)]'
                )}
              >
                <div className='group-hover:hidden'>{plainText}</div>
                <div
                  className={clsx(
                    'text-transparent group-hover:text-gray-900 absolute inset-x-0 top-0',
                    'transition-transform ease-linear duration-[0] group-hover:duration-[var(--scroll-duration)]',
                    'group-hover:delay-[var(--scroll-delay)] delay-0 group-hover:translate-y-[calc(-100%+9rem)]'
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
            <div>{plainText}</div>
          )}
        </div>

        <div
          className={clsx(
            isScrollAnimationEnabled &&
              'transition-opacity duration-300 ease-in-out delay-0 group-hover:delay-[var(--scale-delay)] group-hover:opacity-0'
          )}
        >
          <div className='flex flex-wrap gap-2 mb-4'>
            {tags.map(tag => (
              <div
                key={tag}
                className='text-xs px-2 py-1 flex-shrink-0 border border-gray-300 rounded-full'
              >
                {tag}
              </div>
            ))}
          </div>
          <PostInfo id={id} createdAt={createdAt} />
        </div>
      </Link>
    </div>
  );
}
