'use client';

import useClickTouchNavigationHandler from '@/features/postViewer/hooks/useClickTouchNavigationHandler';
import useKeyboardWheelNavigation from '@/features/postViewer/hooks/useKeyboardWheelNavigation';
import usePostViewer from '@/features/postViewer/hooks/usePostViewer';
import useViewerPagination from '@/features/postViewer/hooks/useViewerPagination';
import { supportsFullscreen } from '@/lib/browser';
import { processMd } from '@/lib/md/md';
import clsx from 'clsx';
import { JSX, useEffect, useLayoutEffect, useState } from 'react';

interface ViewerProps {
  result: JSX.Element;
  caption?: string;
}

export default function PostViewerContainer({ content }: { content: string }) {
  const { pages } = useViewerPagination({ rawContent: content });
  const { pageNumber } = usePostViewer();
  const [viewer, setViewer] = useState<ViewerProps>();
  const navigationHandler = useClickTouchNavigationHandler();
  useKeyboardWheelNavigation();

  useLayoutEffect(() => {
    const container = document.querySelector(
      '[data-viewer-container]'
    ) as HTMLElement;
    if (!container) return;

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
    const updateViewer = async () => {
      if (pageNumber === null) return;
      const pageIndex = pageNumber - 1;
      if (pageIndex >= pages.length) return;
      const { startOffset, endOffset, caption } = pages[pageIndex];
      await processMd({
        source: content.slice(startOffset, endOffset),
        mode: 'viewer',
      }).then(result => {
        setViewer({
          result,
          caption,
        });
      });
    };
    updateViewer();
  }, [content, pageNumber, pages]);

  return (
    <div
      data-viewer-container
      {...navigationHandler}
      className={clsx(
        'prose absolute inset-0 m-auto',
        'w-[calc(var(--fullscreen-width)/var(--container-scale))]',
        'h-[calc(var(--fullscreen-height)/var(--container-scale))]',
        'p-[calc(var(--container-padding)/var(--container-scale))]',
        'scale-[var(--container-scale)]',
        !viewer && 'hidden'
      )}
    >
      {viewer?.result}
      {viewer?.caption && (
        <div className='absolute bottom-0 inset-x-0 mx-auto'>
          <div className='bg-black/70 text-white text-center break-keep wrap-anywhere text-balance px-2 py-1'>
            {viewer.caption}
          </div>
        </div>
      )}
    </div>
  );
}
