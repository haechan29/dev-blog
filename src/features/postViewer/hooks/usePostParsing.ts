'use client';

import { parsePost as parsePostInner } from '@/features/postViewer/domain/lib/parse';
import { Page } from '@/features/postViewer/domain/types/page';
import usePostViewer from '@/features/postViewer/hooks/usePostViewer';
import {
  setCurrentPageIndex,
  setHeadingPageMapping,
  setTotalPage,
} from '@/lib/redux/postPositionSlice';
import {} from '@/lib/redux/postViewerSlice';
import { AppDispatch } from '@/lib/redux/store';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';

export default function usePostParsing() {
  const dispatch = useDispatch<AppDispatch>();

  const [pages, setPages] = useState<Page[] | null>(null);

  const { pageNumber, fullscreenScale } = usePostViewer();

  const page = useMemo(() => {
    if (!pages || !pageNumber) return null;
    return pages[pageNumber - 1];
  }, [pageNumber, pages]);

  const parsePost = useCallback(() => {
    const postContainer = document.querySelector('.post-content');
    if (!postContainer) return;

    const pageHeight = (window.screen.height - 80) / fullscreenScale;
    const { pages, headingPageMapping } = parsePostInner({
      postContainer,
      pageHeight,
      excludeClassNames: ['hide-fullscreen'],
    });

    dispatch(setTotalPage(pages.length));
    dispatch(setCurrentPageIndex(0));
    dispatch(setHeadingPageMapping(headingPageMapping));
    setPages(pages);
  }, [dispatch, fullscreenScale]);

  useEffect(() => {
    const timer = setTimeout(parsePost, 100);
    return () => clearTimeout(timer);
  }, [parsePost]);

  return { page } as const;
}
