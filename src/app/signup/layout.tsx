import { auth } from '@/auth';
import * as UserServerService from '@/features/user/domain/service/userServerService';
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

  const user = await UserServerService.getUserById(session.user.id!);
  if (user) {
    redirect('/');
  }

  return children;
}
