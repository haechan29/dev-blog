import UserProfile from '@/components/post/userProfile';
import UserNavTabs from '@/components/user/userTabs';
import * as SubscriptionServerRepository from '@/features/subscription/data/repository/subscriptionServerRepository';
import * as UserServerService from '@/features/user/domain/service/userServerService';
import { createProps } from '@/features/user/ui/userProps';
import { getUserId } from '@/lib/user';
import clsx from 'clsx';
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
    <div
      className={clsx(
        'mt-(--toolbar-height) mb-8 px-6 md:px-12 xl:px-18',
        'xl:ml-(--sidebar-width)',
        'xl:mr-[calc(var(--toc-width)+var(--toc-margin))]'
      )}
    >
      <div className='flex flex-col gap-8 pt-4 pb-20'>
        <UserProfile
          initialUser={user}
          initialData={subscriptionInfo}
          currentUserId={currentUserId}
        />

        <UserNavTabs userId={userId} />

        {children}
      </div>
    </div>
  );
}
