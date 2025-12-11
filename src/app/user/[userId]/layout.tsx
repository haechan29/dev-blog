import SubscribeButton from '@/components/post/subscribeButton';
import ProfileIcon from '@/components/user/profileIcon';
import UserNavTabs from '@/components/user/userTabs';
import * as UserServerService from '@/features/user/domain/service/userServerService';
import { getUserId } from '@/lib/user';
import { notFound } from 'next/navigation';
import { ReactNode } from 'react';

export default async function UserLayout({
  params,
  children,
}: {
  params: Promise<{ userId: string }>;
  children: ReactNode;
}) {
  const currentUserId = await getUserId();
  const { userId } = await params;
  const user = await UserServerService.fetchUserById(userId);

  if (!user || user.userStatus === 'DELETED') {
    notFound();
  }

  return (
    <div className='flex flex-col gap-8 pt-(--toolbar-height) pb-20 px-6 md:px-12'>
      <div className='flex items-center max-sm:justify-between sm:gap-12'>
        <div className='flex items-center gap-4'>
          <ProfileIcon
            nickname={user.nickname!}
            isActive={user.userStatus === 'ACTIVE'}
            size='lg'
          />
          <div>
            <div className='font-semibold text-gray-900 text-xl'>
              {user.nickname}
            </div>
            <div className='text-sm text-gray-500'>{`구독자 ${100}명`}</div>
          </div>
        </div>

        {currentUserId !== userId && (
          <SubscribeButton
            authorId={userId}
            userId={'123'}
            isSubscribed={false}
          />
        )}
      </div>

      <UserNavTabs userId={userId} />

      {children}
    </div>
  );
}
