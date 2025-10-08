'use client';

import { Page } from '@/features/postViewer/domain/types/page';
import usePostViewer from '@/features/postViewer/hooks/usePostViewer';
import useFullscreenSize from '@/hooks/useFullscreenSize';
import clsx from 'clsx';
import { MouseEvent, TouchEvent, useEffect, useRef } from 'react';

export default function PostViewerContainer({
  page,
  onClick,
  onTouchEnd,
}: {
  page: Page | null;
  onClick: (event: MouseEvent<HTMLDivElement>) => void;
  onTouchEnd: (event: TouchEvent<HTMLDivElement>) => void;
}) {
  const { fullscreenScale, paddingInRem } = usePostViewer();
  const fullscreenSize = useFullscreenSize();

  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof document === 'undefined') return;

    const container = containerRef.current;
    if (!page || !container) return;

    container.innerHTML = '';
    const fragment = document.createDocumentFragment();
    page.forEach(element => {
      fragment.appendChild(element);
    });
    container.appendChild(fragment);
  }, [page]);

  return (
    fullscreenSize && (
      <div
        ref={containerRef}
        onClick={onClick}
        onTouchEnd={onTouchEnd}
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
