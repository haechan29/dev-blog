import ProfileIcon from '@/components/user/profileIcon';
import UserNavTabs from '@/components/user/userTabs';
import * as UserServerService from '@/features/user/domain/service/userServerService';
import { notFound } from 'next/navigation';
import { ReactNode } from 'react';

export default async function UserLayout({
  params,
  children,
}: {
  params: Promise<{ userId: string }>;
  children: ReactNode;
}) {
  const { userId } = await params;
  const user = await UserServerService.fetchUserById(userId);

  if (!user || user.userStatus === 'DELETED') {
    notFound();
  }

  return (
    <div className='flex flex-col gap-8 pt-(--toolbar-height) pb-20 px-6 md:px-12'>
      <div className='flex items-center space-x-3'>
        <ProfileIcon
          nickname={user.nickname!}
          isActive={user.userStatus === 'ACTIVE'}
        />
        <div>
          <div className='font-semibold text-gray-900 text-xl'>
            {user.nickname}
          </div>
          <p className='text-sm text-gray-500'>
            가입일: {new Date(user.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      <UserNavTabs userId={userId} />

      {children}
    </div>
  );
}
