import '@/app/globals.css';
import LayoutClient from '@/components/home/layoutClient';
import { getUserId } from '@/lib/user';
import Providers from '@/providers';
import clsx from 'clsx';
import type { Metadata } from 'next';
import { Geist_Mono } from 'next/font/google';
import Script from 'next/script';
import 'nprogress/nprogress.css';
import 'pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css';
import { ReactNode } from 'react';
import { Toaster } from 'react-hot-toast';
import 'simplebar-react/dist/simplebar.min.css';

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://sharetext.app'),
  title: 'ShareText',
  description: '누구나 글을 쓰고 읽을 수 있는 텍스트 콘텐츠 플랫폼',
  verification: {
    other: {
      'naver-site-verification': '021e131414124305e2c747f031fc4b86b986155c',
    },
  },
  openGraph: {
    title: 'ShareText',
    description: '누구나 글을 쓰고 읽을 수 있는 텍스트 콘텐츠 플랫폼',
    url: 'https://sharetext.app',
    siteName: 'ShareText',
    type: 'website',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const userId = await getUserId();

  return (
    <html lang='ko'>
      <Script
        async
        src='https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1208219641035715'
        crossOrigin='anonymous'
        strategy='afterInteractive'
      />
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
