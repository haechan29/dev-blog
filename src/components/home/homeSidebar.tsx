'use client';

import Sidebar from '@/components/sidebar';
import ProfileIcon from '@/components/user/profileIcon';
import * as SubscriptionClientRepository from '@/features/subscription/data/repository/subscriptionClientRepository';
import { subscriptionKeys } from '@/queries/keys';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useMemo } from 'react';

export default function HomeSidebar({ userId }: { userId: string }) {
  const { data: following, isLoading } = useQuery({
    queryKey: subscriptionKeys.following(userId),
    queryFn: () => SubscriptionClientRepository.getFollowing(userId),
  });

  const filtered = useMemo(() => {
    return following?.filter(user => !!user.nickname);
  }, [following]);

  return (
    !isLoading && (
      <Sidebar isVisible={true} onClose={() => {}}>
        <div className='py-3 text-sm font-semibold text-gray-500'>구독</div>
        <div className='flex flex-col overflow-y-auto'>
          {filtered?.length === 0 && (
            <div className='py-3 px-3 text-sm text-gray-400'>
              구독한 사람이 없습니다
            </div>
          )}

          {filtered?.map(user => (
            <Link
              key={user.id}
              href={`/@${user.id}/posts`}
              className='flex items-center gap-3 py-2 px-3 rounded-sm hover:bg-gray-50'
            >
              <ProfileIcon
                nickname={user.nickname!}
                isActive={true}
                size='sm'
              />

              <div className='text-xs text-gray-900'>{user.nickname!}</div>
            </Link>
          ))}
        </div>
      </Sidebar>
    )
  );
}
