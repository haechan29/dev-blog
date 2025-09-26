'use client';

import usePage from '@/features/postViewer/hooks/usePage';
import clsx from 'clsx';
import { RefObject, useEffect } from 'react';

export default function PostViewerContent({
  postViewerContentRef,
  onContentClick,
  onContentTouch,
}: {
  postViewerContentRef: RefObject<HTMLDivElement | null>;
  onContentClick: (event: React.MouseEvent<HTMLElement>) => void;
  onContentTouch: (event: React.TouchEvent<HTMLElement>) => void;
}) {
  const { page, fullscreenScale } = usePage();

  useEffect(() => {
    const content = postViewerContentRef.current;
    if (!page || !content) return;

    content.innerHTML = '';
    page.forEach(element => {
      const clonedElement = element.cloneNode(true);
      content.appendChild(clonedElement);
    });
  }, [page, postViewerContentRef]);

  return (
    page !== null && (
      <div
        ref={postViewerContentRef}
        onClick={onContentClick}
        onTouchEnd={onContentTouch}
        className={clsx(
          'prose fullscreen w-[calc(100vw/var(--fullscreen-scale))] h-[calc(100vh/var(--fullscreen-scale))]',
          'px-[calc(5rem/var(--fullscreen-scale))] py-[calc(5rem/var(--fullscreen-scale))] mx-auto',
          'scale-[var(--fullscreen-scale)] origin-top'
        )}
        style={{ '--fullscreen-scale': fullscreenScale }}
      />
    )
  );
}
