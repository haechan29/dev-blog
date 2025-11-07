import { Content } from '@/features/write/domain/types/content';
import useWritePost from '@/features/write/hooks/useWritePost';
import useDebounce from '@/hooks/useDebounce';
import clsx from 'clsx';
import { useEffect, useRef } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

export default function WritePostContentPreview({
  parsedContent,
}: {
  parsedContent: Content;
}) {
  const previewRef = useRef<HTMLDivElement | null>(null);
  const debounce = useDebounce();
  const {
    writePost: {
      contentEditorStatus: { isFocused, scrollRatio },
    },
  } = useWritePost();

  useEffect(() => {
    debounce(() => {
      if (!previewRef.current) return;
      if (!isFocused || scrollRatio === undefined) return;

      const preview = previewRef.current;
      const { scrollHeight, clientHeight } = preview;
      const scroll = scrollRatio * (scrollHeight - clientHeight);
      preview.scrollTo({
        top: scroll,
        behavior: 'smooth',
      });
    }, 100);
  }, [isFocused, scrollRatio, debounce]);

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
        ref={previewRef}
        className='flex-1 min-h-0 border-gray-200 border max-lg:rounded-lg lg:rounded-b-lg overflow-y-auto p-4'
      >
        {parsedContent.status === 'success' ? (
          <ErrorBoundary fallback={<div>에러가 발생했습니다</div>}>
            <div className='prose'>{parsedContent.value}</div>
          </ErrorBoundary>
        ) : (
          <p className='text-gray-500'>본문을 입력하면 미리보기가 표시됩니다</p>
        )}
      </div>
    </div>
  );
}
