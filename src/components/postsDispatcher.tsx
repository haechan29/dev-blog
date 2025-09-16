'use client';

import { setTag, setType } from '@/lib/redux/postToolbarSlice';
import { AppDispatch } from '@/lib/redux/store';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

export default function PostsDispatcher({ tag }: { tag: string | null }) {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(setTag(tag));
    dispatch(setType('minimal'));
  }, [dispatch, tag]);

  return <></>;
}
