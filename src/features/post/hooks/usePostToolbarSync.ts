'use client';

import { PostProps } from '@/features/post/ui/postProps';
import {
  setHeadings,
  setIsInPostsPage,
  setTag,
  setTitle,
} from '@/lib/redux/postToolbarSlice';
import { AppDispatch } from '@/lib/redux/store';
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';

export default function usePostToolbarSync(post?: PostProps) {
  const dispatch = useDispatch<AppDispatch>();

  const searchParams = useSearchParams();
  const tag = searchParams.get('tag');

  const title = useMemo(() => post?.title ?? null, [post?.title]);
  const headings = useMemo(() => post?.headings ?? null, [post?.headings]);

  useEffect(() => {
    if (!post) {
      dispatch(setIsInPostsPage(true));
      return () => {
        dispatch(setIsInPostsPage(false));
      };
    }
  }, [dispatch, post]);

  useEffect(() => {
    if (title !== null && headings !== null) {
      dispatch(setTitle(title));
      dispatch(setHeadings(headings));
    }
  }, [dispatch, headings, title]);

  useEffect(() => {
    dispatch(setTag(tag));
  }, [dispatch, tag]);
}
