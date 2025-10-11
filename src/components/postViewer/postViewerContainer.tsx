'use client';

import { Page } from '@/features/postViewer/domain/types/page';
import useClickTouchNavigationHandler from '@/features/postViewer/hooks/useClickTouchNavigationHandler';
import useKeyboardWheelNavigation from '@/features/postViewer/hooks/useKeyboardWheelNavigation';
import { supportsFullscreen } from '@/lib/browser';
import clsx from 'clsx';
import { useEffect, useLayoutEffect, useRef } from 'react';

export default function PostViewerContainer({ page }: { page: Page | null }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const navigationHandler = useClickTouchNavigationHandler();
  useKeyboardWheelNavigation();

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
    if (typeof document === 'undefined' || !page || !containerRef.current)
      return;

    const container = containerRef.current;
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
      {...navigationHandler}
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
