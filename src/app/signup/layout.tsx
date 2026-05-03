import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { ReactNode } from 'react';

export default async function SignupLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  const hasCompletedSignup =
    Boolean(session.user.registeredAt) || Boolean(session.user.nickname);

  if (hasCompletedSignup) {
    redirect('/');
  }

  return children;
}
