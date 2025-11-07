'use client';

import { Content } from '@/features/write/domain/types/content';
import useContentToolbar from '@/features/write/hooks/useContentToolbar';
import useWritePostForm from '@/features/write/hooks/useWritePostForm';
import useScrollLock from '@/hooks/useScrollLock';
import { AppDispatch } from '@/lib/redux/store';
import {
  setContent,
  setInvalidField,
} from '@/lib/redux/write/writePostFormSlice';
import { setContentEditorStatus } from '@/lib/redux/write/writePostSlice';
import { getScrollRatio } from '@/lib/scroll';
import clsx from 'clsx';
import {
  ChangeEvent,
  FocusEvent,
  RefObject,
  UIEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useDispatch } from 'react-redux';

export default function WritePostContentEditor({
  contentEditorRef,
  parsedContent,
}: {
  contentEditorRef: RefObject<HTMLTextAreaElement | null>;
  parsedContent: Content;
}) {
  const {
    writePostForm: {
      draft,
      content: { maxLength, isValid },
    },
  } = useWritePostForm();
  const [contentInner, setContentInner] = useState('');
  const {
    contentToolbar: { shouldAttachToolbarToBottom },
  } = useContentToolbar();

  const dispatch = useDispatch<AppDispatch>();
  const [isLocked, setIsLocked] = useState(false);
  const isError = useMemo(() => {
    return parsedContent.status === 'error';
  }, [parsedContent.status]);

  const isContentTooLong = useMemo(
    () => contentInner.length > maxLength,
    [contentInner.length, maxLength]
  );

  const onChange = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      const textArea = e.currentTarget;
      dispatch(setInvalidField(null));
      setContentInner(textArea.value);
    },
    [dispatch]
  );

  const onFocus = useCallback(
    (e: FocusEvent<HTMLTextAreaElement>) => {
      dispatch(setContentEditorStatus({ isFocused: true }));
      setIsLocked(true);

      const textArea = e.currentTarget;
      const scrollRatio = getScrollRatio(textArea);
      const contentEditorStatus = {
        isFocused: true,
        scrollRatio,
      };
      dispatch(setContentEditorStatus(contentEditorStatus));
    },
    [dispatch]
  );

  const onBlur = useCallback(() => {
    dispatch(setContentEditorStatus({ isFocused: false }));
    setIsLocked(false);

    dispatch(
      setContentEditorStatus({
        isFocused: false,
      })
    );
  }, [dispatch]);

  const onScroll = useCallback(
    (e: UIEvent<HTMLTextAreaElement>) => {
      const textArea = e.currentTarget;
      const scrollRatio = getScrollRatio(textArea);
      const contentEditorStatus = {
        isFocused: true,
        scrollRatio,
      };
      dispatch(setContentEditorStatus(contentEditorStatus));
    },
    [dispatch]
  );

  useScrollLock({ isLocked, allowedSelectors: ['[data-content-editor]'] });

  useEffect(() => {
    if (!draft) return;
    setContentInner(draft);
  }, [draft]);

  useEffect(() => {
    dispatch(setContent(contentInner));
  }, [contentInner, dispatch]);

  return (
    <div className='flex flex-col h-full'>
      <textarea
        data-content-editor
        ref={contentEditorRef}
        value={contentInner}
        onFocus={onFocus}
        onBlur={onBlur}
        onChange={onChange}
        onScroll={onScroll}
        placeholder='본문을 입력하세요'
        className={clsx(
          'flex-1 min-h-0 p-4 resize-none outline-none border',
          shouldAttachToolbarToBottom ? 'rounded-lg' : 'rounded-b-lg',
          isValid && !isError && !isContentTooLong
            ? 'border-gray-200 hover:border-blue-500 focus:border-blue-500'
            : 'border-red-400 animate-shake',
          !contentInner && 'bg-gray-50'
        )}
      />
      <div
        className={clsx(
          'flex justify-end items-center gap-1 text-sm p-2',
          contentInner.length < maxLength * 0.95 && 'hidden',
          isContentTooLong && 'text-red-500'
        )}
      >
        <div>{contentInner.length.toLocaleString()}</div>
        <div>/</div>
        <div>{maxLength.toLocaleString()}</div>
      </div>
    </div>
  );
}
