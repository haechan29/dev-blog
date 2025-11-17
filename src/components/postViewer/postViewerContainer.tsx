'use client';

import { BgmInner, VIEWER_BGM_CONTAINER_ID } from '@/components/md/bgm';
import { Bgm } from '@/features/post/domain/types/bgm';
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
  bgm: Bgm | null;
  scale: number;
  caption: string;
}

export default function PostViewerContainer({ content }: { content: string }) {
  useViewerPagination();
  const { page } = usePostViewer();
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
      if (!page) return;
      const { startOffset, endOffset, caption, bgm, scale } = page;

      await processMd({
        source: content.slice(startOffset, endOffset),
        mode: 'viewer',
      }).then(result => {
        setViewer({
          result,
          bgm,
          scale: scale ?? 1,
          caption: caption ?? '',
        });
      });
    };
    updateViewer();
  }, [content, page]);

  return (
    <div
      data-viewer-container
      {...navigationHandler}
      className={clsx(
        'prose absolute inset-0 m-auto',
        'w-[calc((var(--fullscreen-width)-var(--container-padding)*2)/var(--container-scale))]',
        'h-[calc((var(--fullscreen-height)-var(--container-padding)*2)/var(--container-scale))]',
        'scale-[var(--container-scale)]',
        !viewer && 'hidden'
      )}
    >
      <div
        data-viewer-content
        className='w-full h-full scale-[var(--content-scale)]'
        style={{ '--content-scale': `${viewer?.scale ?? 1}` }}
      >
        {viewer?.result}
      </div>
      {viewer?.bgm && (
        <div
          className='absolute top-0 right-0'
          onClick={e => e.stopPropagation()}
        >
          <BgmInner
            {...viewer.bgm}
            containerId={VIEWER_BGM_CONTAINER_ID}
            mode='viewer'
          />
        </div>
      )}
      {viewer?.caption.trim() && (
        <div className='absolute bottom-0 inset-x-0 mx-auto'>
          <div className='bg-black/70 text-white text-center break-keep wrap-anywhere text-balance px-2 py-1'>
            {viewer.caption}
          </div>
        </div>
      )}
    </div>
  );
}
