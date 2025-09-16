'use client';

import { setTag, setType } from '@/lib/redux/postToolbarSlice';
import { AppDispatch } from '@/lib/redux/store';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

export default function PostsDispatcher() {
  const dispatch = useDispatch<AppDispatch>();

  const searchParams = useSearchParams();
  const tag = searchParams.get('tag');

  useEffect(() => {
    dispatch(setTag(tag));
    dispatch(setType('minimal'));
  }, [dispatch, tag]);

  return <></>;
}
