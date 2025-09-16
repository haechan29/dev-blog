'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/lib/redux/store';
import { setHeadings, setTag, setTitle } from '@/lib/redux/postToolbarSlice';
import { useSearchParams } from 'next/navigation';
import { PostItemProps } from '@/features/post/ui/postItemProps';

export default function postDispatcher({ post }: { post: PostItemProps }) {
  const dispatch = useDispatch<AppDispatch>();

  const searchParams = useSearchParams();
  const tag = searchParams.get('tag');

  useEffect(() => {
    dispatch(setTitle(post.title));
    dispatch(setHeadings(post.headings));
  }, [post]);

  useEffect(() => {
    dispatch(setTag(tag));
  }, []);

  return <></>;
}
