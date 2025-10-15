import PostInfo from '@/components/post/postInfo';
import { PostProps } from '@/features/post/ui/postProps';
import Link from 'next/link';

export default function PostHeader({ post }: { post: PostProps }) {
  return (
    <>
      <Title {...post} />
      <Tags {...post} />
      <PostInfo {...post} />
    </>
  );
}

function Title({ title }: { title: string }) {
  return <div className='text-3xl font-bold mb-6'>{title}</div>;
}

function Tags({ tags }: { tags: string[] }) {
  return (
    <div className='flex flex-wrap gap-3 mb-6'>
      {tags.map(tag => (
        <Link
          key={tag}
          href={`/posts?tag=${tag}`}
          className='text-xs px-2 py-1 border border-gray-300 rounded-full hover:text-blue-500 hover:border-blue-200'
        >
          {tag}
        </Link>
      ))}
    </div>
  );
}
