'use client';

import * as SubscriptionClientRepository from '@/features/subscription/data/repository/subscriptionClientRepository';
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import Link from 'next/link';

export default function HomeSidebar({ userId }: { userId: string }) {
  const { data: following } = useQuery({
    queryKey: ['following', userId],
    queryFn: () => SubscriptionClientRepository.getFollowing(userId),
  });

  return (
    <div
      className={clsx(
        'w-(--sidebar-width) fixed',
        'left-0 top-(--toolbar-height) bottom-0',
        'flex flex-col bg-white',
        'pb-2 md:pb-3 px-4 md:px-6'
      )}
    >
      <div className='py-3 text-sm font-semibold text-gray-500'>구독</div>
      <div className='flex flex-col overflow-y-auto'>
        {following?.map(user => (
          <Link
            key={user.id}
            href={`/user/${user.id}`}
            className='py-3 px-3 text-sm text-gray-900 rounded-sm hover:text-blue-500'
          >
            {user.nickname ?? '익명'}
          </Link>
        ))}
      </div>
    </div>
  );
}
