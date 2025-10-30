'use client';

import ImageSettingsDropdown from '@/components/write/imageSettingsDropdown';
import clsx from 'clsx';
import { MoreVertical } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

export default function WritePostContentPreview({
  htmlSource,
}: {
  htmlSource: string | null;
}) {
  const contentRef = useRef<HTMLDivElement | null>(null);
  const moreButtonRef = useRef<HTMLDivElement | null>(null);
  const imageDropdownTriggerRef = useRef<HTMLDivElement | null>(null);
  const [imageDropdownTriggerPosition, setImageDropdownTriggerPosition] =
    useState({ top: '0px', left: '0px' });
  const [isImageDropDownOpen, setIsImageDropDownOpen] = useState(false);

  const handleImageDropdownClick = useCallback((event: MouseEvent) => {
    const imageDropdownButton = (event.target as Element).closest(
      '.image-dropdown-button'
    );
    const imageDropdownTrigger = imageDropdownTriggerRef.current;
    if (!imageDropdownButton || !imageDropdownTrigger) return;
    const { top, left } = imageDropdownButton.getBoundingClientRect();
    setImageDropdownTriggerPosition({ top: `${top}px`, left: `${left}px` });
    setIsImageDropDownOpen(true);
  }, []);

  useEffect(() => {
    if (htmlSource === null) return;
    if (!contentRef.current || !moreButtonRef.current) return;
    const content = contentRef.current;
    const moreButton = moreButtonRef.current;

    content.innerHTML = htmlSource;
    content.querySelectorAll('.image-wrapper').forEach(imageWrapper => {
      const imageDropdownButton = imageWrapper.querySelector(
        '.image-dropdown-button'
      ) as HTMLButtonElement;
      const moreButtonClone = moreButton.cloneNode(true) as HTMLElement;
      moreButtonClone.style.display = 'block';
      imageDropdownButton.appendChild(moreButtonClone);
    });

    content.addEventListener('click', handleImageDropdownClick);
    return () => content.removeEventListener('click', handleImageDropdownClick);
  }, [handleImageDropdownClick, htmlSource]);

  return (
    <>
      <ImageSettingsDropdown
        isOpen={isImageDropDownOpen}
        setIsOpen={setIsImageDropDownOpen}
      >
        <div
          ref={imageDropdownTriggerRef}
          onClick={() => console.log('클릭')}
          className='w-9 h-9 rounded-full fixed z-[2000]'
          style={{ ...imageDropdownTriggerPosition }}
        />
      </ImageSettingsDropdown>

      <div ref={moreButtonRef} className='hidden'>
        <MoreVertical
          className={clsx(
            'w-9 h-9 text-white rounded-full p-2',
            'bg-black/20 hover:bg-black/30'
          )}
          aria-label='이미지 설정'
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
