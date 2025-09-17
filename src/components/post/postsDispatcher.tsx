'use client';

import { setIsInPostsPage, setTag } from '@/lib/redux/postToolbarSlice';
import { AppDispatch } from '@/lib/redux/store';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

export default function PostsDispatcher({ tag }: { tag: string | null }) {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(setTag(tag));
    dispatch(setIsInPostsPage(true));
    return () => {
      dispatch(setIsInPostsPage(false));
    };
  }, [dispatch, tag]);

  return <></>;
}
