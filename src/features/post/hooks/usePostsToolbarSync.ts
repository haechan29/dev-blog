'use client';

import { setIsInPostsPage, setTag } from '@/lib/redux/postToolbarSlice';
import { AppDispatch } from '@/lib/redux/store';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

export default function usePostsToolbarSync() {
  const dispatch = useDispatch<AppDispatch>();

  const searchParams = useSearchParams();
  const tag = searchParams.get('tag');

  useEffect(() => {
    dispatch(setIsInPostsPage(true));
    return () => {
      dispatch(setIsInPostsPage(false));
    };
  }, [dispatch]);

  useEffect(() => {
    dispatch(setTag(tag));
  }, [dispatch, tag]);
}
