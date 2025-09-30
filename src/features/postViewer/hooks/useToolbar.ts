'use client';

import Heading from '@/features/post/domain/model/heading';
import { toProps } from '@/features/postViewer/domain/model/postViewer';
import useHeading from '@/features/postViewer/hooks/useHeading';
import { setIsToolbarExpanded } from '@/lib/redux/postViewerSlice';
import { AppDispatch, RootState } from '@/lib/redux/store';
import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export default function useToolbar() {
  const dispatch = useDispatch<AppDispatch>();
  const postViewer = useSelector((state: RootState) => state.postViewer);
  const { isToolbarExpanded } = useMemo(
    () => toProps(postViewer),
    [postViewer]
  );
  const [heading, setHeading] = useHeading();

  const toggleIsExpanded = useCallback(
    () => dispatch(setIsToolbarExpanded(!isToolbarExpanded)),
    [dispatch, isToolbarExpanded]
  );

  const handleContentClick = useCallback(
    (heading: Heading) => {
      if (isToolbarExpanded) setHeading(heading);
      toggleIsExpanded();
    },
    [isToolbarExpanded, setHeading, toggleIsExpanded]
  );

  return {
    isExpanded: isToolbarExpanded,
    heading,
    toggleIsExpanded,
    handleContentClick,
  } as const;
}
