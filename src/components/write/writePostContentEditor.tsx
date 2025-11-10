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
import clsx from 'clsx';
import {
  ChangeEvent,
  RefObject,
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
      content: { value: content, isUserInput, maxLength, isValid },
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

  const onFocus = useCallback(() => {
    dispatch(setContentEditorStatus({ isFocused: true }));
    setIsLocked(true);
  }, [dispatch]);

  const onBlur = useCallback(() => {
    const newStatus = setContentEditorStatus({ isFocused: false });
    dispatch(newStatus);
    setIsLocked(false);
  }, [dispatch]);

  useScrollLock({ isLocked, allowedSelectors: ['[data-content-editor]'] });

  useEffect(() => {
    dispatch(setContent({ value: contentInner, isUserInput: true }));
  }, [contentInner, dispatch]);

  useEffect(() => {
    if (!isUserInput) {
      setContentInner(content);
    }
  }, [content, isUserInput]);

  useEffect(() => {
    const onSelectionChange = () => {
      const activeElement = document.activeElement;
      const isActive =
        activeElement?.hasAttribute('data-content-editor') ?? false;
      if (!isActive) return;
      const cursorPosition = (activeElement as HTMLTextAreaElement)
        .selectionStart;
      dispatch(setContentEditorStatus({ cursorPosition }));
    };
    document.addEventListener('selectionchange', onSelectionChange);
    return () =>
      document.removeEventListener('selectionchange', onSelectionChange);
  }, [dispatch]);

  return (
    <div className='flex flex-col h-full'>
      <textarea
        data-content-editor
        ref={contentEditorRef}
        value={contentInner}
        onFocus={onFocus}
        onBlur={onBlur}
        onChange={onChange}
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
