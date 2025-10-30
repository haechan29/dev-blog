'use client';

import ImageSettingsDropdown from '@/components/write/imageSettingsDropdown';
import { canTouch } from '@/lib/browser';
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
  const [settingsButtonStatus, setSettingsButtonStatus] = useState({
    isVisible: false,
    top: '0px',
    left: '0px',
  });
  const { isVisible, top, left } = settingsButtonStatus;
  const [isImageButtonTouched, setIsImageButtonTouched] = useState(false);
  const [isImageDropdownOpen, setIsImageDropdownOpen] = useState(false);

  const onTouchStart = useCallback(
    (event: TouchEvent) => {
      const imageWrapper = (event.target as Element).closest('.image-wrapper');
      if (!imageWrapper) return;

      const imageButton = imageWrapper.querySelector(
        '.image-button'
      ) as Element;
      const { top, left } = imageButton.getBoundingClientRect();
      if (isImageButtonTouched) {
        setIsImageButtonTouched(false);
        setSettingsButtonStatus(prev => ({
          ...prev,
          isVisible: false,
        }));
      } else {
        setIsImageButtonTouched(true);
        setSettingsButtonStatus(() => ({
          top: `${top}px`,
          left: `${left}px`,
          isVisible: true,
        }));
      }
    },
    [isImageButtonTouched]
  );

  const onMouseOver = useCallback((event: MouseEvent) => {
    if (canTouch) return;
    const imageWrapper = (event.target as Element).closest('.image-wrapper');
    if (!imageWrapper) return;

    const imageButton = imageWrapper.querySelector('.image-button') as Element;
    const { top, left } = imageButton.getBoundingClientRect();
    setSettingsButtonStatus(() => ({
      top: `${top}px`,
      left: `${left}px`,
      isVisible: true,
    }));
  }, []);

  const onMouseOut = useCallback(() => {
    if (canTouch) return;

    setSettingsButtonStatus(prev => ({ ...prev, isVisible: false }));
  }, []);

  const updateIsImageDropdownVisible = useCallback(
    (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.classList.contains('image-button')) return;

      if (!isImageDropdownOpen) {
        setIsImageDropdownOpen(true);
      }
    },
    [isImageDropdownOpen]
  );

  useEffect(() => {
    if (htmlSource === null || !contentRef.current) return;
    const content = contentRef.current;
    content.innerHTML = htmlSource;

    content.addEventListener('click', updateIsImageDropdownVisible);
    if (canTouch) {
      content.addEventListener('touchstart', onTouchStart);
    } else {
      content.addEventListener('mouseover', onMouseOver);
      content.addEventListener('mouseout', onMouseOut);
    }
    return () => {
      content.removeEventListener('click', updateIsImageDropdownVisible);
      if (canTouch) {
        content.removeEventListener('touchstart', onTouchStart);
      } else {
        content.removeEventListener('mouseover', onMouseOver);
        content.removeEventListener('mouseout', onMouseOut);
      }
    };
  }, [
    htmlSource,
    onMouseOut,
    onMouseOver,
    onTouchStart,
    updateIsImageDropdownVisible,
  ]);

  return (
    <>
      <ImageSettingsDropdown
        isOpen={isImageDropdownOpen}
        setIsOpen={setIsImageDropdownOpen}
      >
        <div
          className={clsx(
            'fixed z-[2000] pointer-events-none',
            !isVisible && 'opacity-0'
          )}
          style={{ top, left }}
        >
          <MoreVertical
            className={clsx(
              'w-9 h-9 text-white rounded-full p-2',
              'bg-black/10 hover:bg-black/20'
            )}
            aria-label='이미지 설정'
            aria-hidden={!isVisible}
          />
        </div>
      </ImageSettingsDropdown>

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
