'use client';

import { setIsContentVisible } from '@/lib/redux/postToolbarSlice';
import { AppDispatch } from '@/lib/redux/store';
import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';

export default function ContentSectionDetector() {
  const dispatch = useDispatch<AppDispatch>();
  const isInitialMount = useRef(true);

  useEffect(() => {
    const proseElement = document.querySelector('.prose');
    if (!proseElement) return;

    const proseObserver = new IntersectionObserver(
      entries => {
        if (isInitialMount.current) {
          isInitialMount.current = false;
          return;
        }
        dispatch(setIsContentVisible(entries[0].isIntersecting));
      },
      {
        rootMargin: '10% 0px -90% 0px',
      }
    );
    proseObserver.observe(proseElement);
    return () => proseObserver.disconnect();
  }, [dispatch]);

  return <></>;
}
