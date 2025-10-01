'use client';

import Heading from '@/features/post/domain/model/heading';
import usePostViewer from '@/features/postViewer/hooks/usePostViewer';
import { setCurrentHeading } from '@/lib/redux/postPositionSlice';
import { setIsToolbarExpanded } from '@/lib/redux/postViewerSlice';
import { AppDispatch } from '@/lib/redux/store';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

export default function useViewerToolbar() {
  const dispatch = useDispatch<AppDispatch>();
  const { currentHeading, isToolbarExpanded } = usePostViewer();

  const toggleIsExpanded = useCallback(
    () => dispatch(setIsToolbarExpanded(!isToolbarExpanded)),
    [dispatch, isToolbarExpanded]
  );

  const handleContentClick = useCallback(
    (heading: Heading) => {
      if (isToolbarExpanded) setCurrentHeading(heading);
      toggleIsExpanded();
    },
    [isToolbarExpanded, toggleIsExpanded]
  );

  return {
    isExpanded: isToolbarExpanded,
    currentHeading,
    toggleIsExpanded,
    handleContentClick,
  } as const;
}
