import { Content } from '@/features/write/domain/types/content';
import useWritePost from '@/features/write/hooks/useWritePost';
import useDebounce from '@/hooks/useDebounce';
import { scrollToElement } from '@/lib/scroll';
import clsx from 'clsx';
import { useCallback, useEffect } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

export default function WritePostContentPreview({
  parsedContent,
}: {
  parsedContent: Content;
}) {
  const debounce = useDebounce();
  const {
    writePost: {
      contentEditorStatus: { isFocused, cursorPosition },
    },
  } = useWritePost();

  const scrollToCursorPosition = useCallback(
    (contentPreview: Element, cursorPosition: number) => {
      let minLength: number | null = null;
      let targetElement: Element | null = null;

      walkElements(contentPreview, (element: Element) => {
        const startOffsetAttr = element.getAttribute('data-start-offset');
        const endOffsetAttr = element.getAttribute('data-end-offset');
        if (startOffsetAttr === null || endOffsetAttr === null) return;

        const startOffset = parseInt(startOffsetAttr);
        const endOffset = parseInt(endOffsetAttr);
        const length = endOffset - startOffset;

        if (cursorPosition < startOffset || cursorPosition > endOffset) return;
        if (minLength !== null && length >= minLength) return;
        minLength = length;
        targetElement = element;
      });

      if (!targetElement) return;
      scrollToElement(targetElement, { behavior: 'smooth' });
    },
    []
  );

  useEffect(() => {
    debounce(() => {
      const contentPreview = document.querySelector('[data-content-preview]');
      if (!contentPreview) return;
      scrollToCursorPosition(contentPreview, cursorPosition);
    }, 100);
  }, [cursorPosition, debounce, isFocused, scrollToCursorPosition]);

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
          <ErrorBoundary fallback={<div>에러가 발생했습니다</div>}>
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
