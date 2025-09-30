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

export default function useToolbarSync(post?: PostProps) {
  const dispatch = useDispatch<AppDispatch>();

  const searchParams = useSearchParams();
  const tag = searchParams.get('tag');

  const title = useMemo(() => post?.title ?? null, [post?.title]);

  const filteredHeadings = useMemo(
    () => post?.headings.filter(heading => heading.level === 1) ?? null,
    [post?.headings]
  );

  useEffect(() => {
    if (!post) {
      dispatch(setIsInPostsPage(true));
      return () => {
        dispatch(setIsInPostsPage(false));
      };
    }
  }, [dispatch, post]);

  useEffect(() => {
    if (title !== null && filteredHeadings !== null) {
      dispatch(setTitle(title));
      dispatch(setHeadings(filteredHeadings));
    }
  }, [dispatch, filteredHeadings, title]);

  useEffect(() => {
    dispatch(setTag(tag));
  }, [dispatch, tag]);
}
