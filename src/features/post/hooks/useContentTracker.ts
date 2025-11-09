'use client';

import { setIsContentVisible } from '@/lib/redux/post/postToolbarSlice';
import { AppDispatch } from '@/lib/redux/store';
import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';

export default function useContentTracker() {
  const dispatch = useDispatch<AppDispatch>();
  const isInitialMount = useRef(true);

  useEffect(() => {
    const postContent = document.querySelector('[data-post-content]');
    if (!postContent) return;

    const postContentObserver = new IntersectionObserver(
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
    postContentObserver.observe(postContent);
    return () => postContentObserver.disconnect();
  }, [dispatch]);
}
