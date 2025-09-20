'use client';

import { setIsCommentSectionVisible } from '@/lib/redux/postViewerSlice';
import { AppDispatch } from '@/lib/redux/store';
import { RefObject, useEffect } from 'react';
import { useDispatch } from 'react-redux';

export default function CommentSectionDetector({
  commentSectionRef,
}: {
  commentSectionRef: RefObject<HTMLDivElement | null>;
}) {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const commentSectionObserver = new IntersectionObserver(entries =>
      dispatch(setIsCommentSectionVisible(entries[0].isIntersecting))
    );
    if (commentSectionRef.current) {
      commentSectionObserver.observe(commentSectionRef.current);
    }
    return () => commentSectionObserver.disconnect();
  }, [dispatch, commentSectionRef]);

  return <></>;
}
