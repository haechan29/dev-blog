'use client';

import { PostProps } from '@/features/post/ui/postProps';
import { setHeadings, setTitle } from '@/lib/redux/post/postToolbarSlice';
import { AppDispatch } from '@/lib/redux/store';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

export default function usePostToolbarSync(post: PostProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { title, headings } = post;

  useEffect(() => {
    dispatch(setTitle(title));
    dispatch(setHeadings(headings));
  }, [dispatch, headings, title]);
}
