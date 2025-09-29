'use client';

import { Heading } from '@/features/post/domain/model/post';
import { toProps } from '@/features/postViewer/domain/model/postViewer';
import {
  getHeadingsByPage,
  getPageByHeadingId,
} from '@/features/postViewer/domain/types/headingPageMapping';
import { setPageIndex } from '@/lib/redux/postViewerSlice';
import { AppDispatch, RootState } from '@/lib/redux/store';
import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export default function useHeading() {
  const dispatch = useDispatch<AppDispatch>();
  const postViewer = useSelector((state: RootState) => state.postViewer);
  const { pageNumber, headingPageMapping } = useMemo(
    () => toProps(postViewer),
    [postViewer]
  );

  const heading = useMemo(() => {
    if (pageNumber === null || !headingPageMapping) return null;

    const headings = getHeadingsByPage(headingPageMapping, pageNumber - 1);
    if (!headings || headings.length === 0) return null;
    return headings[0];
  }, [headingPageMapping, pageNumber]);

  const setHeading = useCallback(
    (item: Heading) => {
      if (item === heading) return;
      if (!headingPageMapping) return;

      const pageIndex = getPageByHeadingId(headingPageMapping, item.id);
      if (pageIndex === undefined) return;

      dispatch(setPageIndex(pageIndex));
    },
    [dispatch, heading, headingPageMapping]
  );

  return [heading, setHeading] as const;
}
