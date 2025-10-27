import PostInfo from '@/components/post/postInfo';
import { PostProps } from '@/features/post/ui/postProps';
import clsx from 'clsx';
import Link from 'next/link';

export default function PostPreview({
  tag,
  post: { id, title, plainText, tags, createdAt },
}: {
  tag: string | null;
  post: PostProps;
}) {
  return (
    <div className='relative flex flex-col group mb-8'>
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
        <div className='relative mb-4 h-18'>
          <div
            className={clsx(
              'absolute inset-x-0 top-0 leading-6',
              'transition-discrete duration-300 group-hover:duration-500 ease-in-out delay-0 group-hover:delay-500',
              'h-18 line-clamp-3 group-hover:h-30 group-hover:line-clamp-5'
            )}
          >
            {plainText}
          </div>
        </div>

        <div className='group-hover:opacity-0 transition-opacity duration-300 ease-in-out delay-0 group-hover:delay-500'>
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
