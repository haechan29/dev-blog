import UserProfile from '@/components/post/userProfile';
import UserNavTabs from '@/components/user/userTabs';
import * as SubscriptionServerRepository from '@/features/subscription/data/repository/subscriptionServerRepository';
import * as UserServerService from '@/features/user/domain/service/userServerService';
import { createProps } from '@/features/user/ui/userProps';
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
  const [user, subscriptionInfo] = await Promise.all([
    UserServerService.fetchUserById(userId).then(user =>
      user ? createProps(user) : null
    ),
    SubscriptionServerRepository.getSubscriptionInfo(userId),
  ]);

  if (!user || !!user.deletedAt) {
    notFound();
  }

  return (
    <div className='flex flex-col gap-8 pt-(--toolbar-height) pb-20 px-6 md:px-12'>
      <UserProfile
        userId={userId}
        userName={user.nickname}
        userBio={user.bio ?? undefined}
        profileImageUrl={user.profileImageUrl ?? undefined}
        initialData={subscriptionInfo}
        currentUserId={currentUserId}
      />

      <UserNavTabs userId={userId} />

      {children}
    </div>
  );
}
