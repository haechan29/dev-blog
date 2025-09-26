'use client';

import { parsePostIntoPages } from '@/features/postViewer/domain/lib/parse';
import { Page } from '@/features/postViewer/domain/types/page';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { setPageIndex, setTotalPages } from '@/lib/redux/postViewerSlice';
import { AppDispatch, RootState } from '@/lib/redux/store';
import clsx from 'clsx';
import { RefObject, useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export default function PostViewerContent({
  postViewerContentRef,
  onContentClick,
  onContentTouch,
}: {
  postViewerContentRef: RefObject<HTMLDivElement | null>;
  onContentClick: (event: React.MouseEvent<HTMLElement>) => void;
  onContentTouch: (event: React.TouchEvent<HTMLElement>) => void;
}) {
  const [pages, setPages] = useState<Page[]>([]);
  const [isProcessing, setIsProcessing] = useState(true);

  const dispatch = useDispatch<AppDispatch>();
  const postViewer = useSelector((state: RootState) => state.postViewer);

  const [fullscreenScale, setFullscreenScale] = useLocalStorage(
    'fullscreen-scale',
    1.5
  );

  const parsePost = useCallback(() => {
    const postContainer = document.querySelector('.post-content');
    if (!postContainer) return;

    const pageHeight = (window.screen.height - 80) / fullscreenScale;
    const pages = parsePostIntoPages({
      postContainer,
      pageHeight,
      excludeClassNames: ['hide-fullscreen'],
    });

    dispatch(setTotalPages(pages.length));
    dispatch(setPageIndex(0));

    setPages(pages);
    setIsProcessing(false);
  }, [dispatch, fullscreenScale]);

  useEffect(() => {
    const timer = setTimeout(parsePost, 100);
    return () => clearTimeout(timer);
  }, [parsePost]);

  useEffect(() => {
    const content = postViewerContentRef.current;
    const page = pages[postViewer.pageIndex];

    if (content && page) {
      content.innerHTML = '';
      page.forEach(element => {
        const clonedElement = element.cloneNode(true);
        content.appendChild(clonedElement);
      });
    }
  }, [pages, postViewerContentRef, postViewer.pageIndex]);

  return (
    <div
      ref={postViewerContentRef}
      onClick={onContentClick}
      onTouchEnd={onContentTouch}
      className={clsx(
        'prose fullscreen w-[calc(100vw/var(--fullscreen-scale))] h-[calc(100vh/var(--fullscreen-scale))]',
        'px-[calc(5rem/var(--fullscreen-scale))] py-[calc(5rem/var(--fullscreen-scale))] mx-auto',
        'scale-[var(--fullscreen-scale)] origin-top',
        isProcessing && 'hidden'
      )}
      style={{ '--fullscreen-scale': fullscreenScale }}
    />
  );
}
