'use client';

import {
  createProps,
  WritePostContentToolbarProps,
} from '@/features/write/ui/writePostContentToolbarProps';
import useKeyboardHeight from '@/hooks/useKeyboardHeight';
import { canTouch } from '@/lib/browser';
import { AppDispatch, RootState } from '@/lib/redux/store';
import {
  setCanTouch,
  setKeyboardHeight,
} from '@/lib/redux/write/contentToolbarSlice';
import { useEffect, useLayoutEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export default function useContentToolbar() {
  const dispatch = useDispatch<AppDispatch>();
  const writePost = useSelector((state: RootState) => state.writePost);
  const contentToolbar = useSelector((state: RootState) => {
    return state.contentToolbar;
  });
  const [contentToolbarProps, setContentToolbarProps] =
    useState<WritePostContentToolbarProps>(
      createProps(writePost, contentToolbar)
    );
  const { keyboardHeight } = useKeyboardHeight();

  useLayoutEffect(() => {
    dispatch(setCanTouch(canTouch));
  }, [dispatch]);

  useEffect(() => {
    const newContentToolbar = createProps(writePost, contentToolbar);
    setContentToolbarProps(newContentToolbar);
  }, [contentToolbar, writePost]);

  useEffect(() => {
    dispatch(setKeyboardHeight(keyboardHeight));
  }, [dispatch, keyboardHeight]);

  return {
    contentToolbar: contentToolbarProps,
  } as const;
}
