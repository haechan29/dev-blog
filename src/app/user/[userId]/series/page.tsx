import ProfileIcon from '@/components/user/profileIcon';
import UserNavTabs from '@/components/user/userTabs';
import * as UserServerService from '@/features/user/domain/service/userServerService';
import { notFound } from 'next/navigation';

export default async function SeriesPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;

  const user = await UserServerService.fetchUserById(userId);

  if (!user || user.deletedAt !== null) {
    notFound();
  }

  return (
    <div className='flex flex-col gap-8'>
      <div className='flex items-center space-x-3 mb-8'>
        <ProfileIcon isGuest={false} nickname={user.nickname} />
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

      <div className='text-center py-20 text-gray-500'>
        아직 시리즈가 없습니다.
      </div>
    </div>
  );
}
