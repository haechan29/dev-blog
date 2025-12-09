import { auth } from '@/auth';
import UserToolbar from '@/components/user/userToolbar';
import { ReactNode } from 'react';

export default async function SeriesLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();

  return (
    <>
      <UserToolbar isLoggedIn={!session} />

      <div className='pt-(--toolbar-height) pb-20 px-6 md:px-12'>
        {children}
      </div>
    </>
  );
}
