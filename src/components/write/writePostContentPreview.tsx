'use client';

import clsx from 'clsx';
import { MoreVertical } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

export default function WritePostContentPreview({
  htmlSource,
}: {
  htmlSource: string | null;
}) {
  const contentRef = useRef<HTMLDivElement | null>(null);
  const moreButtonRef = useRef<HTMLDivElement | null>(null);
  const [isImageDropdownOpen, setIsImageDropdownOpen] = useState(false);

  useEffect(() => {
    if (htmlSource === null) return;
    if (!contentRef.current || !moreButtonRef.current) return;
    const content = contentRef.current;
    const moreButton = moreButtonRef.current;

    content.innerHTML = htmlSource;
    content.querySelectorAll('.image-wrapper').forEach(imgWrapper => {
      const moreButtonClone = moreButton.cloneNode(true) as HTMLElement;
      moreButtonClone.style.display = 'block';
      imgWrapper.appendChild(moreButtonClone);
    });
  }, [htmlSource]);

  return (
    <>
      {/* <ImageSettingsDropdown
        isOpen={isImageDropdownOpen}
        setIsOpen={setIsImageDropdownOpen}
      /> */}
      <div
        ref={moreButtonRef}
        className='hidden absolute z-[1000] top-2 right-2'
      >
        <MoreVertical
          className={clsx(
            'w-9 h-9 text-white rounded-full p-2 border',
            'bg-black/20 hover:bg-black/30'
          )}
        />
      </div>

      <div className='flex flex-col h-full'>
        <div
          className={clsx(
            'flex px-4 h-12 items-center text-sm border-gray-200 rounded-t-lg border-t border-x max-lg:hidden'
          )}
        >
          미리보기
        </div>
        <div className='flex-1 min-h-0 border-gray-200 border max-lg:rounded-lg lg:rounded-b-lg overflow-y-auto p-4'>
          {htmlSource ? (
            <ErrorBoundary fallback={<div>에러가 발생했습니다</div>}>
              <div ref={contentRef} className='prose' />
            </ErrorBoundary>
          ) : (
            <p className='text-gray-500'>
              본문을 입력하면 미리보기가 표시됩니다
            </p>
          )}
        </div>
      </div>
    </>
  );
}
