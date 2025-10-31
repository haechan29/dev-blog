'use client';

import ImageSettingsDropdown from '@/components/write/imageSettingsDropdown';
import { canTouch } from '@/lib/browser';
import clsx from 'clsx';
import { MoreVertical } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ErrorBoundary } from 'react-error-boundary';

export default function WritePostContentPreview({
  htmlSource,
}: {
  htmlSource: string | null;
}) {
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [isImageDropdownOpen, setIsImageDropdownOpen] = useState(false);
  const [currentImageButtonWrapper, setCurrentImageButtonWrapper] =
    useState<Element | null>(null);

  const onTouchStart = useCallback((event: TouchEvent) => {
    const imageWrapper = (event.target as Element).closest('.image-wrapper');
    if (!imageWrapper) return;

    const isTouched = imageWrapper.hasAttribute('data-is-touched');
    if (isTouched) setIsImageDropdownOpen(false);
    imageWrapper.toggleAttribute('data-is-touched');

    const imageButtonWrapper = imageWrapper.querySelector(
      '.image-button-wrapper'
    ) as Element;
    setCurrentImageButtonWrapper(prev =>
      prev === imageButtonWrapper ? null : imageButtonWrapper
    );
  }, []);

  const onMouseOver = useCallback((event: MouseEvent) => {
    const imageWrapper = (event.target as Element).closest('.image-wrapper');
    if (!imageWrapper) return;

    const imageButtonWrapper = imageWrapper.querySelector(
      '.image-button-wrapper'
    ) as Element;
    setCurrentImageButtonWrapper(imageButtonWrapper);
  }, []);

  const onMouseOut = useCallback((event: MouseEvent) => {
    const imageWrapper = (event.target as Element).closest('.image-wrapper');
    if (!imageWrapper) return;

    setCurrentImageButtonWrapper(null);
  }, []);

  useEffect(() => {
    if (htmlSource === null || !contentRef.current) return;
    const content = contentRef.current;
    content.innerHTML = htmlSource;

    if (canTouch) {
      content.addEventListener('touchstart', onTouchStart);
    } else {
      content.addEventListener('mouseover', onMouseOver);
      content.addEventListener('mouseout', onMouseOut);
    }
    return () => {
      if (canTouch) {
        content.removeEventListener('touchstart', onTouchStart);
      } else {
        content.removeEventListener('mouseover', onMouseOver);
        content.removeEventListener('mouseout', onMouseOut);
      }
    };
  }, [htmlSource, onMouseOut, onMouseOver, onTouchStart]);

  return (
    <>
      {currentImageButtonWrapper &&
        createPortal(
          <ImageSettingsDropdown
            isOpen={isImageDropdownOpen}
            setIsOpen={setIsImageDropdownOpen}
          >
            <div
              onTouchStart={e => e.stopPropagation()}
              aria-label={'이미지 설정'}
              aria-hidden={currentImageButtonWrapper === null}
            >
              <MoreVertical
                className={clsx(
                  'w-9 h-9 text-white rounded-full p-2',
                  'bg-black/10 hover:bg-black/20'
                )}
              />
            </div>
          </ImageSettingsDropdown>,
          currentImageButtonWrapper
        )}

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
