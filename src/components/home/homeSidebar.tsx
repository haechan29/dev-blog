'use client';

import Sidebar from '@/components/sidebar';
import ProfileIcon from '@/components/user/profileIcon';
import * as SubscriptionClientRepository from '@/features/subscription/data/repository/subscriptionClientRepository';
import { subscriptionKeys } from '@/queries/keys';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useMemo } from 'react';
import SimpleBar from 'simplebar-react';

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

        <SimpleBar className='h-full simplebar-hover'>
          <div className='flex flex-col min-h-full'>
            <div className='flex flex-col'>
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
                    size='sm'
                    profileImageUrl={user.profileImageUrl}
                  />

                  <div className='text-xs text-gray-900'>{user.nickname!}</div>
                </Link>
              ))}
            </div>

            <div className='mt-auto py-4'>
              <div className='flex gap-3 text-xs text-gray-500'>
                <Link href='/privacy' className='hover:text-gray-700'>
                  개인정보처리방침
                </Link>
                <Link href='/terms' className='hover:text-gray-700'>
                  이용약관
                </Link>
              </div>
              <div className='text-xs text-gray-400 mt-2'>
                누구나 글을 쓰고 읽는 곳 © ShareText
              </div>
            </div>
          </div>
        </SimpleBar>
      </Sidebar>
    )
  );
}
