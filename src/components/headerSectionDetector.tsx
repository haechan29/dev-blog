'use client';

import { setIsHeadingVisible } from '@/lib/redux/postToolbarSlice';
import { AppDispatch } from '@/lib/redux/store';
import { RefObject, useEffect } from 'react';
import { useDispatch } from 'react-redux';

export default function HeaderSectionDetector({
  headerRef,
}: {
  headerRef: RefObject<null>;
}) {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const headerObserver = new IntersectionObserver(
      entries => dispatch(setIsHeadingVisible(entries[0].isIntersecting)),
      {
        rootMargin: '0px 0px -50% 0px',
      }
    );
    if (headerRef.current) {
      headerObserver.observe(headerRef.current);
    }
    return () => headerObserver.disconnect();
  }, [dispatch, headerRef]);

  return <></>;
}
