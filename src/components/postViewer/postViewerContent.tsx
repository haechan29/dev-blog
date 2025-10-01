'use client';

import { Page } from '@/features/postViewer/domain/types/page';
import usePostViewer from '@/features/postViewer/hooks/usePostViewer';
import clsx from 'clsx';
import { RefObject, useEffect } from 'react';

export default function PostViewerContent({
  page,
  postViewerContentRef,
}: {
  page: Page | null;
  postViewerContentRef: RefObject<HTMLDivElement | null>;
}) {
  const { fullscreenScale } = usePostViewer();

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
