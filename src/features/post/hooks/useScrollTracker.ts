'use client';

import useThrottle from '@/hooks/useThrottle';
import { setIsScrollingDown } from '@/lib/redux/post/postToolbarSlice';
import { AppDispatch } from '@/lib/redux/store';
import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';

export default function useScrollTracker() {
  const dispatch = useDispatch<AppDispatch>();
  const lastScrollYRef = useRef<number | null>(null);
  const throttle = useThrottle();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      lastScrollYRef.current = window.scrollY;
    }

    const handleScroll = () => {
      throttle(() => {
        if (typeof window === 'undefined' || lastScrollYRef.current === null)
          return;

        const lastScrollY = lastScrollYRef.current;
        const currentScrollY = window.scrollY;
        dispatch(setIsScrollingDown(currentScrollY > lastScrollY));

        lastScrollYRef.current = currentScrollY;
      }, 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [dispatch, throttle]);
}
