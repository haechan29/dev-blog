'use client';

import { Content } from '@/features/write/domain/types/content';
import {
  ContentEditorBlurStatus,
  ContentEditorFocusStatus,
} from '@/features/write/domain/types/contentEditorStatus';
import useScrollLock from '@/hooks/useScrollLock';
import { AppDispatch } from '@/lib/redux/store';
import { setContentEditorStatus } from '@/lib/redux/writePostSlice';
import { getScrollRatio } from '@/lib/scroll';
import clsx from 'clsx';
import {
  ChangeEvent,
  FocusEvent,
  RefObject,
  UIEvent,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { useDispatch } from 'react-redux';

export default function WritePostContentEditor({
  contentEditorRef,
  parsedContent,
  value: content,
  maxLength,
  isValid,
  shouldAttachToolbarToBottom,
  setContent,
  resetInvalidField,
  setIsEditorFocused,
}: {
  contentEditorRef: RefObject<HTMLTextAreaElement | null>;
  parsedContent: Content;
  value: string;
  maxLength: number;
  isValid: boolean;
  shouldAttachToolbarToBottom: boolean;
  setContent: (content: string) => void;
  resetInvalidField: () => void;
  setIsEditorFocused: (isEditorFocused: boolean) => void;
}) {
  const dispatch = useDispatch<AppDispatch>();
  const [isLocked, setIsLocked] = useState(false);
  const isError = useMemo(() => {
    return parsedContent.status === 'error';
  }, [parsedContent.status]);

  const isContentTooLong = useMemo(
    () => content.length > maxLength,
    [content.length, maxLength]
  );

  const onChange = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      const textArea = e.currentTarget;
      resetInvalidField();
      setContent(textArea.value);
    },
    [resetInvalidField, setContent]
  );

  const onFocus = useCallback(
    (e: FocusEvent<HTMLTextAreaElement>) => {
      setIsEditorFocused(true);
      setIsLocked(true);

      const textArea = e.currentTarget;
      const scrollRatio = getScrollRatio(textArea);
      const contentEditorStatus = {
        isFocused: true,
        scrollRatio,
      };
      dispatch(setContentEditorStatus(contentEditorStatus));
    },
    [dispatch, setIsEditorFocused]
  );

  const onBlur = useCallback(() => {
    setIsEditorFocused(false);
    setIsLocked(false);

    const contentEditorStatus: ContentEditorBlurStatus = {
      isFocused: false,
    };
    dispatch(setContentEditorStatus(contentEditorStatus));
  }, [dispatch, setIsEditorFocused]);

  const onScroll = useCallback(
    (e: UIEvent<HTMLTextAreaElement>) => {
      const textArea = e.currentTarget;
      const scrollRatio = getScrollRatio(textArea);
      const contentEditorStatus: ContentEditorFocusStatus = {
        isFocused: true,
        scrollRatio,
      };
      dispatch(setContentEditorStatus(contentEditorStatus));
    },
    [dispatch]
  );

  useScrollLock({ isLocked, allowedSelectors: ['[data-content-editor]'] });

  return (
    <div className='flex flex-col h-full'>
      <textarea
        data-content-editor
        ref={contentEditorRef}
        onFocus={onFocus}
        onBlur={onBlur}
        value={content}
        onChange={onChange}
        onScroll={onScroll}
        onTouchMove={e => e.stopPropagation()}
        placeholder='본문을 입력하세요'
        className={clsx(
          'flex-1 min-h-0 p-4 resize-none outline-none border',
          shouldAttachToolbarToBottom ? 'rounded-lg' : 'rounded-b-lg',
          isValid && !isError && !isContentTooLong
            ? 'border-gray-200 hover:border-blue-500 focus:border-blue-500'
            : 'border-red-400 animate-shake',
          !content && 'bg-gray-50'
        )}
      />
      <div
        className={clsx(
          'flex justify-end items-center gap-1 text-sm p-2',
          content.length < maxLength * 0.95 && 'hidden',
          isContentTooLong && 'text-red-500'
        )}
      >
        <div>{content.length.toLocaleString()}</div>
        <div>/</div>
        <div>{maxLength.toLocaleString()}</div>
      </div>
    </div>
  );
}
