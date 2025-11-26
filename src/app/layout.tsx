import '@/app/globals.css';
import { auth } from '@/auth';
import LayoutClient from '@/components/layoutClient';
import LayoutContainer from '@/components/layoutContainer';
import { fetchPosts } from '@/features/post/domain/service/postServerService';
import { createProps } from '@/features/post/ui/postProps';
import Providers from '@/providers';
import clsx from 'clsx';
import type { Metadata } from 'next';
import { Geist_Mono } from 'next/font/google';
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
  const [posts, session] = await Promise.all([
    fetchPosts().then(posts => posts.map(createProps)),
    auth(),
  ]);

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
          <LayoutContainer posts={posts} session={session}>
            {children}
          </LayoutContainer>
        </Providers>

        <Toaster />
      </body>
    </html>
  );
}
