import { auth } from '@/auth';
import { notFound } from 'next/navigation';
import { ReactNode } from 'react';

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();
  const isAdmin = session?.user?.id === process.env.ADMIN_USER_ID;

  if (!isAdmin) {
    notFound();
  }

  return children;
}
