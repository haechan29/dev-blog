'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function UserNavTabs({ userId }: { userId: string }) {
  const pathname = usePathname();
  const isPostsPage = pathname.includes('/posts');
  const isSeriesPage = pathname.includes('/series');

  return (
    <div className='border-b border-gray-200'>
      <div className='flex gap-8'>
        <Link
          href={`/@${userId}/posts`}
          className={`pb-4 px-1 ${
            isPostsPage
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          글
        </Link>
        <Link
          href={`/@${userId}/series`}
          className={`pb-4 px-1 ${
            isSeriesPage
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          시리즈
        </Link>
      </div>
    </div>
  );
}
