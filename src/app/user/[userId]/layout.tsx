import { auth } from '@/auth';
import ProfileIcon from '@/components/user/profileIcon';
import UserNavTabs from '@/components/user/userTabs';
import UserToolbar from '@/components/user/userToolbar';
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
  const session = await auth();
  const { userId } = await params;
  const user = await UserServerService.fetchUserById(userId);

  if (!user || user.deletedAt !== null) {
    notFound();
  }

  return (
    <>
      <UserToolbar isLoggedIn={!!session} />

      <div className='flex flex-col gap-8 pt-(--toolbar-height) pb-20 px-6 md:px-12'>
        <div className='flex items-center space-x-3'>
          <ProfileIcon />
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
    </>
  );
}
