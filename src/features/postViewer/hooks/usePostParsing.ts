'use client';

import { parsePost as parsePostInner } from '@/features/postViewer/domain/lib/parse';
import { toProps } from '@/features/postViewer/domain/model/postViewer';
import { Page } from '@/features/postViewer/domain/types/page';
import {
  setCurrentPageIndex,
  setHeadingPageMapping,
  setTotalPage,
} from '@/lib/redux/postPositionSlice';
import {} from '@/lib/redux/postViewerSlice';
import { AppDispatch, RootState } from '@/lib/redux/store';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export default function usePostParsing() {
  const dispatch = useDispatch<AppDispatch>();
  const postViewer = useSelector((state: RootState) => state.postViewer);

  const [pages, setPages] = useState<Page[] | null>(null);

  const { pageNumber, fullscreenScale } = useMemo(
    () => toProps(postViewer),
    [postViewer]
  );
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

    dispatch(setCurrentPageIndex(0));
    dispatch(setTotalPage(pages.length));
    dispatch(setHeadingPageMapping(headingPageMapping));
    setPages(pages);
  }, [dispatch, fullscreenScale]);

  useEffect(() => {
    const timer = setTimeout(parsePost, 100);
    return () => clearTimeout(timer);
  }, [parsePost]);

  return { page } as const;
}
