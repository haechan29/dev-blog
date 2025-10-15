import PostToolbar from '@/components/post/postToolbar';
import { ReactNode } from 'react';

export default async function PostLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <PostToolbar />
      {children}
    </>
  );
}
