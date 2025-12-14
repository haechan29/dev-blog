import { auth } from '@/auth';
import UserToolbar from '@/components/user/userToolbar';
import { ReactNode } from 'react';

export default async function UserToolbarLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();

  return (
    <>
      <UserToolbar isLoggedIn={!!session} />
      {children}
    </>
  );
}
