'use client';

import { RefObject, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/lib/redux/store';
import { setType } from '@/lib/redux/postToolbarSlice';

export default function HeaderSectionDetector({
  headerRef,
}: {
  headerRef: RefObject<null>;
}) {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const headerObserver = new IntersectionObserver(
      entries =>
        dispatch(setType(entries[0].isIntersecting ? 'empty' : 'basic')),
      {
        rootMargin: '-80px 0px -100% 0px',
      }
    );
    if (headerRef.current) {
      headerObserver.observe(headerRef.current);
    }
    return () => headerObserver.disconnect();
  }, []);

  return <></>;
}
