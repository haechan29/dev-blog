'use client';

import ImageSettingsDropdown from '@/components/write/imageSettingsDropdown';
import { canTouch } from '@/lib/browser';
import clsx from 'clsx';
import { MoreVertical } from 'lucide-react';
import {
  MouseEvent,
  TouchEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import { ErrorBoundary } from 'react-error-boundary';

export default function WritePostContentPreview({
  htmlSource,
}: {
  htmlSource: string | null;
}) {
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [isImageDropdownOpen, setIsImageDropdownOpen] = useState(false);
  const [activeImageWrapper, setActiveImageWrapper] = useState<Element | null>(
    null
  );

  const onTouchStart = useCallback((event: TouchEvent<HTMLDivElement>) => {
    const imageWrapper = (event.target as Element).closest(
      '[data-image-wrapper]'
    );
    if (!imageWrapper) return;

    setActiveImageWrapper(prev => {
      const isActive = imageWrapper.hasAttribute('data-is-active');
      if (isActive) {
        imageWrapper.removeAttribute('data-is-active');
      } else {
        prev?.removeAttribute('data-is-active');
        imageWrapper.setAttribute('data-is-active', '');
      }
      return isActive ? null : imageWrapper;
    });
  }, []);

  const onMouseOver = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      if (canTouch) return;
      if (isImageDropdownOpen) return;

      const imageWrapper = (event.target as Element).closest(
        '[data-image-wrapper]'
      );
      if (!imageWrapper) return;

      imageWrapper.setAttribute('data-is-active', '');
      setActiveImageWrapper(imageWrapper);
    },
    [isImageDropdownOpen]
  );

  const onMouseOut = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      if (canTouch) return;
      if (isImageDropdownOpen) return;

      const imageWrapper = (event.target as Element).closest(
        '[data-image-wrapper]'
      );
      if (isImageDropdownOpen || !imageWrapper) return;

      imageWrapper.removeAttribute('data-is-active');
      setActiveImageWrapper(null);
    },
    [isImageDropdownOpen]
  );

  useEffect(() => {
    if (!contentRef.current || !htmlSource) return;
    const content = contentRef.current;
    content.innerHTML = htmlSource;
  }, [htmlSource]);

  useEffect(() => {
    if (!activeImageWrapper) setIsImageDropdownOpen(false);
  }, [activeImageWrapper]);

  return (
    <>
      {activeImageWrapper &&
        createPortal(
          <ImageSettingsDropdown
            isOpen={isImageDropdownOpen}
            setIsOpen={setIsImageDropdownOpen}
          >
            <div
              onMouseOver={onMouseOver}
              onMouseOut={onMouseOut}
              aria-label={'이미지 설정'}
              aria-hidden={activeImageWrapper === null}
              className='absolute z-[1000] top-2 right-2'
            >
              <MoreVertical
                className={clsx(
                  'w-9 h-9 text-white rounded-full p-2',
                  'bg-black/10 hover:bg-black/20'
                )}
              />
            </div>
          </ImageSettingsDropdown>,
          activeImageWrapper
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
              <div
                ref={contentRef}
                className='prose'
                onTouchStart={onTouchStart}
                onMouseOver={onMouseOver}
                onMouseOut={onMouseOut}
              />
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
