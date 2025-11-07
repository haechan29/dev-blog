'use client';

import { setIsContentVisible } from '@/lib/redux/post/postToolbarSlice';
import { AppDispatch } from '@/lib/redux/store';
import { RefObject, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';

export default function useContentTracker(
  postContentRef: RefObject<HTMLElement | null>
) {
  const dispatch = useDispatch<AppDispatch>();
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (!postContentRef.current) return;

    const postContent = postContentRef.current;
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
  }, [dispatch, postContentRef]);
}
