'use client';

import { Page } from '@/features/postViewer/domain/types/page';
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
          'w-[calc(var(--fullscreen-width)/var(--container-scale))]',
          'h-[calc(var(--fullscreen-height)/var(--container-scale))]',
          'pt-[calc(var(--container-padding)/var(--container-scale))]',
          'pr-[calc(var(--container-padding)/var(--container-scale))]',
          'pb-[calc(var(--container-padding)/var(--container-scale))]',
          'pl-[calc(var(--container-padding)/var(--container-scale))]',
          'scale-[var(--container-scale)]',
          !page && 'hidden'
        )}
        style={{
          '--fullscreen-width': `${fullscreenSize.width}px`,
          '--fullscreen-height': `${fullscreenSize.height}px`,
        }}
      />
    )
  );
}
