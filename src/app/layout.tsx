import '@/app/globals.css';
import { auth } from '@/auth';
import LayoutClient from '@/components/layoutClient';
import LayoutContainer from '@/components/layoutContainer';
import { fetchPosts } from '@/features/post/domain/service/postServerService';
import { createProps } from '@/features/post/ui/postProps';
import * as UserServerService from '@/features/user/domain/service/userServerService';
import Providers from '@/providers';
import clsx from 'clsx';
import type { Metadata } from 'next';
import { Geist_Mono } from 'next/font/google';
import { cookies } from 'next/headers';
import 'nprogress/nprogress.css';
import 'pretendard/dist/web/variable/pretendardvariable.css';
import { ReactNode, Suspense } from 'react';
import { Toaster } from 'react-hot-toast';

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: '임해찬',
  description: '개발자 임해찬의 블로그',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const session = await auth();

  if (!session) {
    const cookieStore = await cookies();
    const userId = cookieStore.get('userId')?.value;
    if (!userId) {
      const newUserId = await UserServerService.createUser();
      cookieStore.set('userId', newUserId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 365,
      });
    }
  }

  const posts = await fetchPosts().then(posts => posts.map(createProps));

  return (
    <html lang='ko'>
      <body
        className={clsx(
          geistMono.variable,
          'min-h-dvh bg-white antialiased overflow-y-auto'
        )}
      >
        <Suspense>
          <LayoutClient />
        </Suspense>

        <Providers>
          <LayoutContainer posts={posts}>{children}</LayoutContainer>
        </Providers>

        <Toaster />
      </body>
    </html>
  );
}
