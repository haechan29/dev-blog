'use client';

import { parsePost as parsePostInner } from '@/features/postViewer/domain/lib/parse';
import { Page } from '@/features/postViewer/domain/types/page';
import usePostViewer from '@/features/postViewer/hooks/usePostViewer';
import useViewerContainerSize from '@/features/postViewer/hooks/useViewerContainerSize';
import {
  setHeadingPageMapping,
  setPagination,
} from '@/lib/redux/postPositionSlice';
import {} from '@/lib/redux/postViewerSlice';
import { AppDispatch } from '@/lib/redux/store';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';

export default function usePostParsing() {
  const dispatch = useDispatch<AppDispatch>();

  const [pages, setPages] = useState<Page[] | null>(null);

  const { pageNumber } = usePostViewer();
  const containerSize = useViewerContainerSize();

  const page = useMemo(() => {
    if (!pages || pageNumber === null) return null;
    return pages[pageNumber - 1];
  }, [pageNumber, pages]);

  const parsePost = useCallback(() => {
    const postContainer = document.querySelector('.post-content');
    if (!containerSize || !postContainer) return;
    const { width: containerWidth, height: containerHeight } = containerSize;

    const { pages, headingPageMapping } = parsePostInner({
      postContainer,
      containerWidth,
      containerHeight,
      excludeClassNames: ['hide-fullscreen'],
    });

    dispatch(setHeadingPageMapping(headingPageMapping));
    dispatch(setPagination({ current: 0, total: pages.length }));
    setPages(pages);
  }, [dispatch, containerSize]);

  useEffect(() => {
    const timer = setTimeout(parsePost, 100);
    return () => clearTimeout(timer);
  }, [parsePost]);

  return { page } as const;
}
