'use client';

import { Page } from '@/features/postViewer/domain/types/page';
import { supportsFullscreen } from '@/lib/browser';
import clsx from 'clsx';
import {
  MouseEvent,
  TouchEvent,
  useEffect,
  useLayoutEffect,
  useRef,
} from 'react';

export default function PostViewerContainer({
  page,
  onClick,
  onTouchEnd,
}: {
  page: Page | null;
  onClick: (event: MouseEvent<HTMLDivElement>) => void;
  onTouchEnd: (event: TouchEvent<HTMLDivElement>) => void;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (containerRef.current === null) return;

    const container = containerRef.current;
    container.style.setProperty(
      '--fullscreen-width',
      supportsFullscreen ? '100dvw' : '100dvh'
    );
    container.style.setProperty(
      '--fullscreen-height',
      supportsFullscreen ? '100dvh' : '100dvw'
    );
  }, []);

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
    <div
      ref={containerRef}
      onClick={onClick}
      onTouchEnd={onTouchEnd}
      className={clsx(
        'prose absolute inset-0 m-auto',
        'w-[calc(var(--fullscreen-width)/var(--container-scale))]',
        'h-[calc(var(--fullscreen-height)/var(--container-scale))]',
        'p-[calc(var(--container-padding)/var(--container-scale))]',
        'scale-[var(--container-scale)]',
        !page && 'hidden'
      )}
    />
  );
}
