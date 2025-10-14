'use client';

import { setAreCommentsVisible } from '@/lib/redux/postViewerSlice';
import { AppDispatch } from '@/lib/redux/store';
import { RefObject, useEffect } from 'react';
import { useDispatch } from 'react-redux';

export default function useCommentsTracker({
  commentsRef: commentsRef,
}: {
  commentsRef: RefObject<HTMLDivElement | null>;
}) {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const commentsObserver = new IntersectionObserver(entries =>
      dispatch(setAreCommentsVisible(entries[0].isIntersecting))
    );
    if (commentsRef.current) {
      commentsObserver.observe(commentsRef.current);
    }
    return () => commentsObserver.disconnect();
  }, [dispatch, commentsRef]);
}
