'use client';

import usePostStat from '@/features/postStat/hooks/usePostStat';

export default function PostInfo({
  id: postId,
  authorName,
  createdAt,
}: {
  id: string;
  authorName: string;
  createdAt: string;
}) {
  const {
    stat: { viewCount },
  } = usePostStat({ postId });

  return (
    <div className='flex gap-2 items-center text-xs text-gray-500'>
      <div>{authorName}</div>
      <Divider />
      <div>{createdAt}</div>
      <Divider />
      <div>{`조회 ${viewCount}`}</div>
    </div>
  );
}

function Divider() {
  return <div className='w-[3px] h-[3px] rounded-full bg-gray-500' />;
}
