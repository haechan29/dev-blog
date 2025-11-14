'use client';

import { Page } from '@/features/postViewer/domain/types/page';
import useClickTouchNavigationHandler from '@/features/postViewer/hooks/useClickTouchNavigationHandler';
import useKeyboardWheelNavigation from '@/features/postViewer/hooks/useKeyboardWheelNavigation';
import usePostViewer from '@/features/postViewer/hooks/usePostViewer';
import useViewerPagination from '@/features/postViewer/hooks/useViewerPagination';
import { supportsFullscreen } from '@/lib/browser';
import { processMd } from '@/lib/md/md';
import clsx from 'clsx';
import { JSX, useEffect, useLayoutEffect, useRef, useState } from 'react';

export default function PostViewerContainer({
  page,
  content,
}: {
  page: Page | null;
  content: string;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { pages } = useViewerPagination({ rawContent: content });
  const { pageNumber } = usePostViewer();
  const [result, setResult] = useState<JSX.Element | null>(null);
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

  // useEffect(() => {
  //   if (typeof document === 'undefined' || !page || !containerRef.current)
  //     return;

  //   const container = containerRef.current;
  //   container.innerHTML = '';
  //   const wrapper = document.createElement('div');
  //   wrapper.className = 'relative w-full h-full';
  //   page.forEach(element => {
  //     wrapper.appendChild(element);
  //   });
  //   container.appendChild(wrapper);
  // }, [page]);

  useEffect(() => {
    const render = async () => {
      if (pageNumber === null) return;
      const pageIndex = pageNumber - 1;
      if (pageIndex >= pages.length) return;
      const { startOffset, endOffset } = pages[pageIndex];
      await processMd({
        source: content.slice(startOffset, endOffset),
        mode: 'viewer',
      }).then(result => setResult(result));
    };
    render();
  }, [content, pageNumber, pages]);

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
        !result && 'hidden'
      )}
    >
      {result}
    </div>
  );
}
