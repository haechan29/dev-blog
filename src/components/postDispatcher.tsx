'use client';

import { PostItemProps } from '@/features/post/ui/postItemProps';
import { setHeadings, setTag, setTitle } from '@/lib/redux/postToolbarSlice';
import { AppDispatch } from '@/lib/redux/store';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

export default function PostDispatcher({ post }: { post: PostItemProps }) {
  const dispatch = useDispatch<AppDispatch>();

  const searchParams = useSearchParams();
  const tag = searchParams.get('tag');

  useEffect(() => {
    dispatch(setTitle(post.title));
    dispatch(setHeadings(post.headings.filter(heading => heading.level === 1)));
  }, [dispatch, post]);

  useEffect(() => {
    dispatch(setTag(tag));
  }, [dispatch, tag]);

  return <></>;
}
