'use client';

import { WritePostContentToolbar } from '@/features/write/domain/model/writePostContentToolbar';
import { createProps } from '@/features/write/ui/writePostContentToolbarProps';
import useKeyboardHeight from '@/hooks/useKeyboardHeight';
import { canTouch } from '@/lib/browser';
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';

export default function useWritePostContentToolbar() {
  const [contentToolbar, setContentToolbar] = useState<WritePostContentToolbar>(
    {
      isEditorFocused: false,
      canTouch: false,
      keyboardHeight: 0,
    }
  );
  const contentToolbarProps = useMemo(
    () => createProps(contentToolbar),
    [contentToolbar]
  );
  const { keyboardHeight } = useKeyboardHeight();

  const setIsEditorFocused = useCallback((isEditorFocused: boolean) => {
    setContentToolbar(prev => ({ ...prev, isEditorFocused }));
  }, []);

  useLayoutEffect(() => {
    setContentToolbar(prev => ({
      ...prev,
      canTouch: canTouch,
    }));
  }, []);

  useEffect(() => {
    setContentToolbar(prev => ({
      ...prev,
      keyboardHeight: keyboardHeight ?? 0,
    }));
  }, [keyboardHeight]);

  return {
    contentToolbar: contentToolbarProps,
    setIsEditorFocused,
  } as const;
}
