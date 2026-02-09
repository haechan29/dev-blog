'use client';

import { Content } from '@/features/write/domain/types/content';
import useWritePostForm from '@/features/write/hooks/useWritePostForm';
import useDebounce from '@/hooks/useDebounce';
import { processMd } from '@/lib/md/md';
import { AppDispatch, RootState } from '@/lib/redux/store';
import { setIsParseError } from '@/lib/redux/write/writePostFormSlice';
import clsx from 'clsx';
import { MutableRefObject, useCallback, useEffect, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useDispatch, useSelector } from 'react-redux';

export default function WritePostContentPreview({
  isScrollSyncPausedRef,
}: {
  isScrollSyncPausedRef: MutableRefObject<boolean>;
}) {
  const dispatch = useDispatch<AppDispatch>();
  const debounce = useDebounce();
  const {
    contentEditorStatus: { cursorPosition, cursorOffset },
  } = useSelector((state: RootState) => state.writePost);

  const {
    writePostForm: {
      content: { value: content },
    },
  } = useWritePostForm();

  const [parsedContent, setParsedContent] = useState<Content>({
    status: 'idle',
  });

  const scrollToCursorPosition = useCallback(
    (contentPreview: Element, cursorPosition: number, cursorOffset: number) => {
      const target = findScrollTarget(contentPreview, cursorPosition);
      if (!target) return;

      if (target.closest('pre')) return;

      const previewTop = contentPreview.getBoundingClientRect().top;

      let targetTop: number;

      const hasOnlyOneTextNode =
        target.childNodes.length === 1 &&
        target.childNodes[0].nodeType === Node.TEXT_NODE;

      if (hasOnlyOneTextNode) {
        const textNode = target.childNodes[0] as Text;
        const startOffset = parseInt(target.getAttribute('data-start-offset')!);
        const localOffset = Math.min(
          cursorPosition - startOffset,
          textNode.textContent.length
        );

        const range = document.createRange();
        range.setStart(textNode, localOffset);
        range.setEnd(textNode, localOffset);
        targetTop = range.getBoundingClientRect().top;
      } else {
        targetTop = target.getBoundingClientRect().top;
      }

      const offsetTop = targetTop - previewTop + contentPreview.scrollTop;

      contentPreview.scrollTo({
        behavior: 'smooth',
        top: offsetTop - cursorOffset,
      });
    },
    []
  );

  useEffect(() => {
    const parseMd = async (content: string) => {
      if (content.length === 0) {
        setParsedContent({ status: 'idle' });
        return;
      }

      try {
        const result = await processMd({ source: content, mode: 'preview' });
        setParsedContent({ status: 'success', value: result });
      } catch {
        setParsedContent({ status: 'error' });
      }
    };

    parseMd(content);
  }, [content]);

  useEffect(() => {
    debounce(() => {
      if (parsedContent.status !== 'success') return;
      if (isScrollSyncPausedRef.current) return;
      const contentPreview = document.querySelector('[data-content-preview]');
      if (!contentPreview) return;
      scrollToCursorPosition(contentPreview, cursorPosition, cursorOffset);
    }, 100);
  }, [
    cursorOffset,
    cursorPosition,
    debounce,
    parsedContent.status,
    scrollToCursorPosition,
    isScrollSyncPausedRef,
  ]);

  useEffect(() => {
    const isParseError = parsedContent.status === 'error';
    dispatch(setIsParseError(isParseError));
  }, [dispatch, parsedContent.status]);

  return (
    <div className='flex flex-col h-full'>
      <div
        className={clsx(
          'flex px-4 h-12 items-center text-sm border-gray-200 rounded-t-lg border-t border-x max-lg:hidden'
        )}
      >
        미리보기
      </div>
      <div
        data-content-preview
        className='prose flex-1 min-h-0 border-gray-200 border max-lg:rounded-lg lg:rounded-b-lg overflow-y-auto p-4'
      >
        {parsedContent.status === 'success' ? (
          <ErrorBoundary
            fallback={<div>에러가 발생했습니다</div>}
            resetKeys={[parsedContent.value]}
          >
            {parsedContent.value}
          </ErrorBoundary>
        ) : (
          <p className='text-gray-500'>본문을 입력하면 미리보기가 표시됩니다</p>
        )}
      </div>
    </div>
  );
}

function walkElements(
  root: Element,
  callback: (element: Element) => boolean | void
) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT, null);

  let node;
  while ((node = walker.nextNode())) {
    const result = callback(node as Element);
    if (result === false) break;
  }
}

function findScrollTarget(
  root: Element,
  cursorPosition: number
): Element | null {
  let closest: { element: Element; distance: number } | null = null;

  walkElements(root, (element: Element) => {
    const startOffsetAttr = element.getAttribute('data-start-offset');
    const endOffsetAttr = element.getAttribute('data-end-offset');
    if (startOffsetAttr === null || endOffsetAttr === null) return;

    const startOffset = parseInt(startOffsetAttr);
    const endOffset = parseInt(endOffsetAttr);
    if (cursorPosition < startOffset || cursorPosition > endOffset) return;

    const distance = endOffset - startOffset;

    if (closest !== null && distance > closest.distance) return;
    closest = { element, distance };
  });

  if (!closest) return null;
  let target = (closest as { element: Element; distance: number }).element;

  if (!isTextElement(target)) {
    let closestBefore: { element: Element; distance: number } | null = null;

    walkElements(target, (element: Element) => {
      if (!isTextElement(element)) return;

      const endOffsetAttr = element.getAttribute('data-end-offset');
      if (endOffsetAttr === null) return;

      const endOffset = parseInt(endOffsetAttr);
      if (endOffset >= cursorPosition) return;

      const distance = cursorPosition - endOffset;

      if (closestBefore !== null && distance >= closestBefore.distance) return;
      closestBefore = { element, distance };
    });

    if (closestBefore) {
      target = (closestBefore as { element: Element; distance: number })
        .element;
    }
  }

  return target;
}

function isTextElement(element: Element) {
  return (
    element.matches('span') &&
    element.childNodes.length === 1 &&
    element.childNodes[0].nodeType === Node.TEXT_NODE
  );
}
