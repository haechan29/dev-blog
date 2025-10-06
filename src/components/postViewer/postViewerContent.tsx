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
  const { fullscreenScale, paddingInRem } = usePostViewer();

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
    <div
      ref={postViewerContentRef}
      className={clsx(
        'prose fullscreen w-[calc(100vw/var(--fullscreen-scale))] h-[calc(100vh/var(--fullscreen-scale))] mx-auto',
        'pt-[calc(var(--padding-top)/var(--fullscreen-scale))]',
        'pr-[calc(var(--padding-right)/var(--fullscreen-scale))]',
        'pb-[calc(var(--padding-bottom)/var(--fullscreen-scale))]',
        'pl-[calc(var(--padding-left)/var(--fullscreen-scale))]',
        'scale-[var(--fullscreen-scale)] origin-top',
        page === null && 'invisible'
      )}
      style={{
        '--fullscreen-scale': fullscreenScale,
        '--padding-top': `${paddingInRem.top}rem`,
        '--padding-right': `${paddingInRem.right}rem`,
        '--padding-bottom': `${paddingInRem.bottom}rem`,
        '--padding-left': `${paddingInRem.left}rem`,
      }}
    />
  );
}
