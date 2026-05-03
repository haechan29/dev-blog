import { auth } from '@/auth';
import HomeLayoutClient from '@/components/home/homeLayoutClient';
import { cookies } from 'next/headers';
import { ReactNode } from 'react';

export default async function HomeLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();
  const userId =
    session?.user?.id ?? (await cookies()).get('userId')?.value;

  return (
    <HomeLayoutClient isLoggedIn={!!session} userId={userId}>
      {children}
    </HomeLayoutClient>
  );
}
