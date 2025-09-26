'use client';

import { parsePostIntoPages } from '@/features/postViewer/domain/lib/parse';
import { toProps } from '@/features/postViewer/domain/model/postViewer';
import { Page } from '@/features/postViewer/domain/types/page';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { setPaging } from '@/lib/redux/postViewerSlice';
import { AppDispatch, RootState } from '@/lib/redux/store';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export default function usePage() {
  const dispatch = useDispatch<AppDispatch>();
  const postViewer = useSelector((state: RootState) => state.postViewer);

  const [pages, setPages] = useState<Page[] | null>(null);

  const { pageNumber } = useMemo(() => toProps(postViewer), [postViewer]);
  const page = useMemo(
    () =>
      pages !== null && pageNumber !== null ? pages[pageNumber - 1] : null,
    [pageNumber, pages]
  );

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

    dispatch(setPaging({ index: 0, total: pages.length }));
    setPages(pages);
  }, [dispatch, fullscreenScale]);

  useEffect(() => {
    const timer = setTimeout(parsePost, 100);
    return () => clearTimeout(timer);
  }, [parsePost]);

  return { page, fullscreenScale } as const;
}
