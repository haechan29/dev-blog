'use client';

import { PostProps } from '@/features/post/ui/postProps';
import usePostStat from '@/features/postStat/hooks/usePostStat';
import Link from 'next/link';

export default function PostInfo({
  post: { id: postId, userId, authorName, createdAt },
}: {
  post: PostProps;
}) {
  const {
    stat: { viewCount },
  } = usePostStat({ postId });

  return (
    <div className='flex gap-2 items-center text-xs text-gray-500'>
      <>
        <Link
          href={`/@${userId}/posts`}
          className='text-gray-900 hover:underline'
        >
          {authorName}
        </Link>
        <Divider />
      </>
      <div>{createdAt}</div>
      <Divider />
      <div>{`조회 ${viewCount}`}</div>
    </div>
  );
}

function Divider() {
  return <div className='w-[3px] h-[3px] rounded-full bg-gray-500' />;
}
