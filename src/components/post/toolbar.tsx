'use client';

import PostsToolbar from '@/components/post/postsToolbar';
import PostToolbar from '@/components/post/postToolbar';
import { usePathname } from 'next/navigation';

export default function Toolbar() {
  const pathname = usePathname();
  if (pathname === '/posts') {
    return <PostsToolbar />;
  } else if (pathname.match(/^\/posts\/[^/]+$/)) {
    return (
      <>
        <PostsToolbar className='max-xl:hidden' />
        <PostToolbar className='xl:hidden' />
      </>
    );
  } else {
    return null;
  }
}
