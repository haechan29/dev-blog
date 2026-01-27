'use client';

import { BgmButton, VIEWER_BGM_CONTAINER_ID } from '@/components/md/bgm';
import { PageBuilder } from '@/features/postViewer/domain/model/pageBuilder';
import useDebounce from '@/hooks/useDebounce';
import { processMd } from '@/lib/md/md';
import { setRequestedBgm } from '@/lib/redux/bgmControllerSlice';
import {
  setCurrentPageIndex,
  setPages,
} from '@/lib/redux/post/postViewerSlice';
import { AppDispatch, RootState } from '@/lib/redux/store';
import clsx from 'clsx';
import { JSX, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';

interface ContainerProps {
  result: JSX.Element;
  bgm: string | null;
  caption?: string;
}

export default function PostViewerContainer({
  content,
  supportsFullscreen,
}: {
  content: string;
  supportsFullscreen: boolean;
}) {
  const dispatch = useDispatch<AppDispatch>();
  const debounce = useDebounce();

  const isPlaying = useSelector(
    (state: RootState) => state.bgmController.isPlaying
  );
  const isViewerMode = useSelector(
    (state: RootState) => state.postViewer.isViewerMode
  );
  const pages = useSelector((state: RootState) => state.postViewer.pages);
  const currentPageIndex = useSelector(
    (state: RootState) => state.postViewer.currentPageIndex
  );
  const page = useMemo(
    () => (currentPageIndex !== null ? pages[currentPageIndex] : null),
    [currentPageIndex, pages]
  );
  const [result, setResult] = useState<JSX.Element | null>(null);
  const [container, setContainer] = useState<ContainerProps>();
  const [isMounted, setIsMounted] = useState(false);

  const prevBgmRef = useRef<string | null>(null);
  const prevIsViewerModeRef = useRef(false);

  useEffect(() => {
    const viewerMeasure = document.querySelector('[data-viewer-measurement]');
    if (!result || !viewerMeasure) return;

    const measure = () =>
      debounce(() => {
        const containerHeight = (viewerMeasure as HTMLElement).offsetHeight;
        const elements = Array.from(viewerMeasure.children) as HTMLElement[];

        const pages = new PageBuilder(containerHeight).build(elements);
        if (pages && pages.length > 0) {
          dispatch(setPages(pages));
          dispatch(setCurrentPageIndex(0));
        }
      }, 100);

    measure();

    if (supportsFullscreen) {
      window.addEventListener('resize', measure);
      return () => window.removeEventListener('resize', measure);
    }
  }, [debounce, dispatch, result, supportsFullscreen]);

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

  useEffect(() => {
    const isFirstEntry = !prevIsViewerModeRef.current && isViewerMode;
    prevIsViewerModeRef.current = isViewerMode;

    if (!isViewerMode || isFirstEntry) return;

    if (isPlaying && page?.bgm && page.bgm !== prevBgmRef.current) {
      dispatch(
        setRequestedBgm({
          src: page.bgm,
          containerId: `${VIEWER_BGM_CONTAINER_ID}-${page.bgm}`,
        })
      );
    }
    prevBgmRef.current = page?.bgm ?? null;
  }, [dispatch, isPlaying, isViewerMode, page?.bgm]);

  return (
    <div className='w-full h-full relative'>
      <div
        className={clsx(
          'prose w-full h-full relative flex justify-center',
          'absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 '
        )}
      >
        {container?.result && (
          <div
            data-viewer-container
            data-supports-fullscreen={supportsFullscreen}
            className='w-[calc(100%/var(--container-scale))] h-[calc(100%/var(--container-scale))] scale-(--container-scale) origin-top relative'
          >
            {container.result}

            {container?.caption?.trim() && (
              <div className='w-full absolute left-1/2 -translate-x-1/2 bottom-0 flex justify-center'>
                <div className='w-fit bg-black/70 text-white text-center break-keep wrap-anywhere text-balance px-2 py-1'>
                  {container.caption}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {container?.bgm && (
        <div
          className='absolute top-0 right-0'
          onClick={e => e.stopPropagation()}
        >
          <BgmButton
            src={container.bgm}
            containerId={`${VIEWER_BGM_CONTAINER_ID}-${container.bgm}`}
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
                ? 'w-(--container-width) h-(--container-height)'
                : 'w-(--container-height) h-(--container-width)'
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
