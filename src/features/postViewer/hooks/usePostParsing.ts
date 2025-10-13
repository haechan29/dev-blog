'use client';

import { parsePost as parsePostInner } from '@/features/postViewer/domain/lib/parse';
import { Page } from '@/features/postViewer/domain/types/page';
import usePostViewer from '@/features/postViewer/hooks/usePostViewer';
import useViewerContainerSize from '@/features/postViewer/hooks/useViewerContainerSize';
import {
  setHeadingPageMapping,
  setPagination,
} from '@/lib/redux/postPositionSlice';
import { AppDispatch } from '@/lib/redux/store';
import { RefObject, useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';

export default function usePostParsing(
  postContentRef: RefObject<HTMLElement | null>
) {
  const dispatch = useDispatch<AppDispatch>();

  const [pages, setPages] = useState<Page[] | null>(null);

  const { pageNumber } = usePostViewer();
  const containerSize = useViewerContainerSize();

  const page = useMemo(() => {
    if (!pages || pageNumber === null) return null;
    return pages[pageNumber - 1];
  }, [pageNumber, pages]);

  const parsePost = useCallback(() => {
    if (!containerSize || !postContentRef.current) return;

    const postContent = postContentRef.current;
    const { width: containerWidth, height: containerHeight } = containerSize;

    const { pages, headingPageMapping } = parsePostInner({
      postElement: postContent,
      containerWidth,
      containerHeight,
      excludeClassNames: ['hide-fullscreen'],
    });

    dispatch(setHeadingPageMapping(headingPageMapping));
    dispatch(setPagination({ current: 0, total: pages.length }));
    setPages(pages);
  }, [containerSize, dispatch, postContentRef]);

  useEffect(() => {
    const timer = setTimeout(parsePost, 100);
    return () => clearTimeout(timer);
  }, [parsePost]);

  return { page } as const;
}
