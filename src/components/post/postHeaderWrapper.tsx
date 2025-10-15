'use client';

import useHeaderTracker from '@/features/post/hooks/useHeaderTracker';
import { ReactNode, useRef } from 'react';

export default function PostHeaderWrapper({
  children,
}: {
  children: ReactNode;
}) {
  const headerRef = useRef(null);
  useHeaderTracker(headerRef);

  return (
    <div ref={headerRef} className='mb-10'>
      {children}
    </div>
  );
}
