import PostInfo from '@/components/post/postInfo';
import { PostProps } from '@/features/post/ui/postProps';
import clsx from 'clsx';
import Link from 'next/link';

export default function PostPreview({
  tag,
  post,
}: {
  tag: string | null;
  post: PostProps;
}) {
  return (
    <div className='w-full py-8 border-b border-b-gray-200 text-gray-900 group'>
      <Link
        href={`/posts/${post.id}${tag ? `?tag=${tag}` : ''}`}
        className='text-gray-900'
      >
        <Title {...post} />
        <Content {...post} />
      </Link>

      <Tags {...post} />
      <PostInfo {...post} />
    </div>
  );
}

function Title({ title }: { title: string }) {
  return (
    <div className='text-2xl font-semibold mb-4 line-clamp-2'>{title}</div>
  );
}

function Content({ plainText }: { plainText: string }) {
  return (
    <div className='relative mb-4 h-18'>
      <div
        className={clsx(
          'absolute left-0 top-0 leading-6',
          'transition-transform|discrete duration-300 ease-in-out',
          'scale-[1] w-[calc(100%)] group-hover:scale-[1.2] group-hover:w-[calc(100%/1.2)] origin-top-left',
          'h-18 line-clamp-3 group-hover:h-30 group-hover:line-clamp-5'
        )}
      >
        {plainText}
      </div>
    </div>
  );
}

function Tags({ tags }: { tags: string[] }) {
  return (
    <div
      className={clsx(
        'flex flex-wrap gap-2 mb-4',
        'transition-opacity duration-300 ease-in-out',
        'group-hover:opacity-0 group-hover:pointer-events-none'
      )}
    >
      {tags.map(tag => (
        <Link
          href={`/posts?tag=${tag}`}
          key={tag}
          className='text-xs px-2 py-1 flex-shrink-0 border border-gray-300 rounded-full hover:text-blue-500 hover:border-blue-200'
        >
          {tag}
        </Link>
      ))}
    </div>
  );
}
