'use client';

import { toProps } from '@/features/postViewer/domain/model/postViewer';
import { Page } from '@/features/postViewer/domain/types/page';
import { RootState } from '@/lib/redux/store';
import clsx from 'clsx';
import { RefObject, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';

export default function PostViewerContent({
  page,
  postViewerContentRef,
}: {
  page: Page | null;
  postViewerContentRef: RefObject<HTMLDivElement | null>;
}) {
  const postViewer = useSelector((state: RootState) => state.postViewer);
  const { fullscreenScale } = useMemo(() => toProps(postViewer), [postViewer]);

  useEffect(() => {
    const content = postViewerContentRef.current;
    if (!page || !content) return;

    content.innerHTML = '';
    page.forEach(element => {
      const clonedElement = element.cloneNode(true);
      content.appendChild(clonedElement);
    });
  }, [page, postViewerContentRef]);

  return (
    page !== null && (
      <div
        ref={postViewerContentRef}
        className={clsx(
          'prose fullscreen w-[calc(100vw/var(--fullscreen-scale))] h-[calc(100vh/var(--fullscreen-scale))]',
          'px-[calc(5rem/var(--fullscreen-scale))] py-[calc(5rem/var(--fullscreen-scale))] mx-auto',
          'scale-[var(--fullscreen-scale)] origin-top'
        )}
        style={{ '--fullscreen-scale': fullscreenScale }}
      />
    )
  );
}
