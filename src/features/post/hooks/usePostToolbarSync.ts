'use client';

import { PostProps } from '@/features/post/ui/postProps';
import {
  setHeadings,
  setTag,
  setTitle,
} from '@/lib/redux/post/postToolbarSlice';
import { AppDispatch } from '@/lib/redux/store';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

export default function usePostToolbarSync(post: PostProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { title, headings } = post;
  const searchParams = useSearchParams();
  const tag = searchParams.get('tag');

  useEffect(() => {
    dispatch(setTitle(title));
    dispatch(setHeadings(headings));
  }, [dispatch, headings, title]);

  useEffect(() => {
    dispatch(setTag(tag));
  }, [dispatch, tag]);
}
