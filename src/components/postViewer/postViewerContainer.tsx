'use client';

import { Page } from '@/features/postViewer/domain/types/page';
import usePostViewer from '@/features/postViewer/hooks/usePostViewer';
import useViewerContainerSize from '@/features/postViewer/hooks/useViewerContainerSize';
import clsx from 'clsx';
import { RefObject, useEffect } from 'react';

export default function PostViewerContainer({
  page,
  postViewerContainerRef,
}: {
  page: Page | null;
  postViewerContainerRef: RefObject<HTMLDivElement | null>;
}) {
  const { fullscreenScale } = usePostViewer();
  const containerSize = useViewerContainerSize();

  useEffect(() => {
    if (typeof document === 'undefined') return;

    const container = postViewerContainerRef.current;
    if (!page || !container) return;

    container.innerHTML = '';
    const fragment = document.createDocumentFragment();
    page.forEach(element => {
      fragment.appendChild(element);
    });
    container.appendChild(fragment);
  }, [page, postViewerContainerRef]);

  return (
    containerSize &&
    page && (
      <div
        ref={postViewerContainerRef}
        className={clsx(
          'prose absolute inset-0 m-auto',
          'w-[calc(var(--fullscreen-width)/var(--fullscreen-scale))]',
          'h-[calc(var(--fullscreen-height)/var(--fullscreen-scale))]',
          'pt-[calc(var(--padding-top)/var(--fullscreen-scale))]',
          'pr-[calc(var(--padding-right)/var(--fullscreen-scale))]',
          'pb-[calc(var(--padding-bottom)/var(--fullscreen-scale))]',
          'pl-[calc(var(--padding-left)/var(--fullscreen-scale))]',
          'scale-[var(--fullscreen-scale)]',
          !page && 'hidden'
        )}
        style={{
          '--fullscreen-width': `${fullscreenSize.width}px`,
          '--fullscreen-height': `${fullscreenSize.height}px`,
          '--padding-top': `${paddingInRem.top}rem`,
          '--padding-right': `${paddingInRem.right}rem`,
          '--padding-bottom': `${paddingInRem.bottom}rem`,
          '--padding-left': `${paddingInRem.left}rem`,
          '--fullscreen-scale': fullscreenScale,
        }}
      />
    )
  );
}
