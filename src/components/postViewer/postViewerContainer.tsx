'use client';

import { BgmInner, VIEWER_BGM_CONTAINER_ID } from '@/components/md/bgm';
import { Bgm } from '@/features/post/domain/types/bgm';
import useKeyboardWheelNavigation from '@/features/postViewer/hooks/useKeyboardWheelNavigation';
import usePostViewer from '@/features/postViewer/hooks/usePostViewer';
import useViewerPagination from '@/features/postViewer/hooks/useViewerPagination';
import { processMd } from '@/lib/md/md';
import clsx from 'clsx';
import { JSX, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface ContainerProps {
  result: JSX.Element;
  bgm: Bgm | null;
  caption?: string;
}

export default function PostViewerContainer({
  content,
  supportsFullscreen,
}: {
  content: string;
  supportsFullscreen: boolean;
}) {
  const { page } = usePostViewer();
  const [result, setResult] = useState<JSX.Element | null>(null);
  const [container, setContainer] = useState<ContainerProps>();
  const [isMounted, setIsMounted] = useState(false);

  useViewerPagination(result);
  useKeyboardWheelNavigation();

  useEffect(() => {
    const render = async () => {
      await processMd({ source: content, mode: 'viewer' }).then(result => {
        setResult(result);
      });
    };
    render();
  }, [content]);

  useEffect(() => {
    const updateViewer = async () => {
      if (!page) return;
      const { startOffset, endOffset, caption, bgm } = page;

      await processMd({
        source: content.slice(startOffset, endOffset),
        mode: 'viewer',
      }).then(result => {
        setContainer({
          result,
          bgm,
          caption,
        });
      });
    };
    updateViewer();
  }, [content, page]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className='w-full h-full relative'>
      <div
        data-viewer-container
        className={clsx(
          'prose w-full h-full relative flex justify-center',
          'absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 '
        )}
      >
        {container?.result && (
          <div className='w-[calc(100%/var(--container-scale))] h-[calc(100%/var(--container-scale))] scale-(--container-scale) origin-top'>
            {container.result}
          </div>
        )}

        {container?.caption?.trim() && (
          <div
            className={clsx(
              'absolute left-1/2 -translate-x-1/2 bottom-0 flex justify-center',
              'w-[calc(100%/var(--container-scale))] scale-(--container-scale)'
            )}
          >
            <div className='w-fit bg-black/70 text-white text-center break-keep wrap-anywhere text-balance px-2 py-1'>
              {container.caption}
            </div>
          </div>
        )}
      </div>

      {container?.bgm && (
        <div
          className='absolute top-0 right-0'
          onClick={e => e.stopPropagation()}
        >
          <BgmInner
            {...container.bgm}
            containerId={VIEWER_BGM_CONTAINER_ID}
            mode='viewer'
          />
        </div>
      )}

      {isMounted &&
        createPortal(
          <div
            data-viewer-measurement
            className={clsx(
              'prose fixed top-0 left-[200%]',
              supportsFullscreen
                ? 'w-[calc((100dvw-2*var(--container-padding))/var(--container-scale))] h-[calc((100dvh-2*var(--container-padding))/var(--container-scale))]'
                : 'w-[calc((100dvh-2*var(--container-padding))/var(--container-scale))] h-[calc((100dvw-2*var(--container-padding))/var(--container-scale))]'
            )}
            aria-hidden='true'
          >
            {result}
          </div>,
          document.body
        )}
    </div>
  );
}
