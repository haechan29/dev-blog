'use client';

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
  UIEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useDispatch } from 'react-redux';

export default function WritePostContentEditor() {
  const {
    writePostForm: {
      isParseError,
      content: { value: content, isUserInput, maxLength, isValid },
    },
  } = useWritePostForm();
  const [contentInner, setContentInner] = useState('');
  const {
    contentToolbar: { shouldAttachToolbarToBottom },
  } = useContentToolbar();

  const dispatch = useDispatch<AppDispatch>();
  const [isLocked, setIsLocked] = useState(false);
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

  const onScroll = useCallback(
    (e: UIEvent<HTMLTextAreaElement>) => {
      const textArea = e.currentTarget;
      const cursorOffset = getCursorOffset(textArea);
      dispatch(setContentEditorStatus({ cursorOffset }));
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
      const activeElement = document.activeElement as HTMLTextAreaElement;
      const isActive =
        activeElement?.hasAttribute('data-content-editor') ?? false;
      if (!isActive) return;
      const cursorPosition = activeElement.selectionStart;
      const cursorOffset = getCursorOffset(activeElement);
      dispatch(setContentEditorStatus({ cursorPosition, cursorOffset }));
    };
    document.addEventListener('selectionchange', onSelectionChange);
    return () => {
      document.removeEventListener('selectionchange', onSelectionChange);
    };
  }, [dispatch]);

  return (
    <div className='flex flex-col h-full'>
      <textarea
        data-content-editor
        value={contentInner}
        onFocus={onFocus}
        onBlur={onBlur}
        onChange={onChange}
        onScroll={onScroll}
        placeholder='본문을 입력하세요'
        className={clsx(
          'flex-1 min-h-0 p-4 resize-none outline-none border scrollbar-hide',
          shouldAttachToolbarToBottom ? 'rounded-lg' : 'rounded-b-lg',
          isValid && !isParseError && !isContentTooLong
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

function getCursorOffset(textarea: HTMLTextAreaElement) {
  const { value, selectionStart, scrollTop } = textarea;
  const textBeforeCursor = value.substring(0, selectionStart);
  const lines = textBeforeCursor.split('\n').length - 1;

  const { paddingTop } = getComputedStyle(textarea);
  const lineHeight = getMeasuredLineHeight(textarea);

  const cursorScrollTop = lines * lineHeight + parseInt(paddingTop);
  const cursorOffset = cursorScrollTop - scrollTop;
  return cursorOffset;
}

function getMeasuredLineHeight(textarea: HTMLTextAreaElement) {
  const cacheLineHeight = textarea.getAttribute('data-measured-line-height');
  if (cacheLineHeight) return parseInt(cacheLineHeight);

  const clone = textarea.cloneNode(false) as HTMLTextAreaElement;
  Object.assign(clone.style, {
    position: 'absolute',
    visibility: 'hidden',
    display: 'block',
    resize: 'none',
  });

  document.body.appendChild(clone);
  clone.rows = 1;
  const singleLineHeight = clone.offsetHeight;
  clone.rows = 2;
  const doubleLineHeight = clone.offsetHeight;
  document.body.removeChild(clone);

  const measuredLineHeight = doubleLineHeight - singleLineHeight;
  textarea.setAttribute('data-measured-line-height', `${measuredLineHeight}`);
  return measuredLineHeight;
}
