import '@/app/globals.css';
import RootLayoutClient from '@/components/rootLayoutClient';
import Providers from '@/providers';
import clsx from 'clsx';
import type { Metadata } from 'next';
import { Geist_Mono } from 'next/font/google';
import 'nprogress/nprogress.css';
import 'pretendard/dist/web/variable/pretendardvariable.css';
import { Toaster } from 'react-hot-toast';

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: '임해찬',
  description: '개발자 임해찬의 블로그',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='ko'>
      <body
        className={clsx(
          geistMono.variable,
          'min-h-dvh bg-white antialiased overflow-y-auto'
        )}
      >
        <RootLayoutClient />
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  );
}
