import '@/app/globals.css';
import LayoutClient from '@/components/home/layoutClient';
import { getUserId } from '@/lib/user';
import Providers from '@/providers';
import clsx from 'clsx';
import type { Metadata } from 'next';
import { Geist_Mono } from 'next/font/google';
import 'nprogress/nprogress.css';
import 'pretendard/dist/web/variable/pretendardvariable.css';
import { ReactNode } from 'react';
import { Toaster } from 'react-hot-toast';
import 'simplebar-react/dist/simplebar.min.css';

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'ShareText',
  description: '누구나 글을 쓰고 읽을 수 있는 텍스트 콘텐츠 플랫폼',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const userId = await getUserId();

  return (
    <html lang='ko'>
      <body
        className={clsx(
          geistMono.variable,
          'min-h-dvh bg-white antialiased overflow-y-auto'
        )}
      >
        <Providers>
          <LayoutClient userId={userId}>{children}</LayoutClient>
        </Providers>

        <Toaster />
      </body>
    </html>
  );
}
