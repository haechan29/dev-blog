import { auth } from '@/auth';
import HomeLayoutClient from '@/components/home/homeLayoutClient';
import { cookies } from 'next/headers';
import { ReactNode } from 'react';

export default async function TagLayout({
  params,
  children,
}: {
  params: Promise<{ tag: string }>;
  children: ReactNode;
}) {
  const session = await auth();
  const userId =
    session?.user?.user_id ?? (await cookies()).get('userId')?.value;

  const { tag: encodedTag } = await params;
  const tag = decodeURIComponent(encodedTag);

  return (
    <HomeLayoutClient isLoggedIn={!!session} userId={userId} tag={tag}>
      {children}
    </HomeLayoutClient>
  );
}
