'use client';

import { useEffect } from 'react';
import { setType } from '@/lib/redux/postToolbarSlice';
import { AppDispatch } from '@/lib/redux/store';
import { useDispatch } from 'react-redux';

export default function ContentSectionDetector() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const proseElement = document.querySelector('.prose');
    if (!proseElement) return;

    const proseObserver = new IntersectionObserver(
      entries =>
        dispatch(setType(entries[0].isIntersecting ? 'collapsed' : 'basic')),
      {
        rootMargin: '-20px 0px -100% 0px',
      }
    );
    proseObserver.observe(proseElement);
    return () => proseObserver.disconnect();
  }, []);

  return <></>;
}
