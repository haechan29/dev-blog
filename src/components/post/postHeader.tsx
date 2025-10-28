import PostInfo from '@/components/post/postInfo';
import { PostProps } from '@/features/post/ui/postProps';
import clsx from 'clsx';

export default function PostHeader({ post }: { post: PostProps }) {
  const { title, tags } = post;
  return (
    <div className='flex flex-col gap-6'>
      <div className='text-3xl font-bold line-clamp-2'>{title}</div>

      <div className='flex'>
        <div className='w-full flex overflow-x-auto scrollbar-hide'>
          <div className='flex gap-3'>
            {tags.map((tag, index) => (
              <div
                key={tag}
                className={clsx(
                  'text-center text-xs px-2 py-1 border border-gray-300 rounded-full',
                  index >= 3 && 'max-w-20 truncate'
                )}
              >
                {tag}
              </div>
            ))}
          </div>
        </div>
      </div>

      <PostInfo {...post} />
    </div>
  );
}
