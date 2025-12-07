import '@/app/globals.css';
import { auth } from '@/auth';
import LayoutClient from '@/components/layoutClient';
import { fetchPosts } from '@/features/post/domain/service/postServerService';
import { createProps } from '@/features/post/ui/postProps';
import * as UserServerService from '@/features/user/domain/service/userServerService';
import Providers from '@/providers';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import clsx from 'clsx';
import type { Metadata } from 'next';
import { Geist_Mono } from 'next/font/google';
import 'nprogress/nprogress.css';
import 'pretendard/dist/web/variable/pretendardvariable.css';
import { ReactNode } from 'react';
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
  const queryClient = new QueryClient();

  if (session?.user?.id) {
    queryClient.prefetchQuery({
      queryKey: ['user'],
      queryFn: () => UserServerService.fetchUserByAuthId(session.user!.id!),
    });
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
        <Providers>
          <HydrationBoundary state={dehydrate(queryClient)}>
            <LayoutClient posts={posts}>{children}</LayoutClient>
          </HydrationBoundary>
        </Providers>

        <Toaster />
      </body>
    </html>
  );
}
