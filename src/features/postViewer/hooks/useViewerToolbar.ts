'use client';

import Heading from '@/features/post/domain/model/heading';
import usePostViewer from '@/features/postViewer/hooks/usePostViewer';
import useDebounce from '@/hooks/useDebounce';
import { canTouch } from '@/lib/browser';
import { setCurrentHeading } from '@/lib/redux/post/postReaderSlice';
import {
  setIsMouseOnToolbar,
  setIsToolbarExpanded,
  setIsToolbarTouched,
} from '@/lib/redux/post/postViewerSlice';
import { AppDispatch } from '@/lib/redux/store';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

export default function useViewerToolbar() {
  const dispatch = useDispatch<AppDispatch>();
  const debounce = useDebounce();
  const { isToolbarExpanded } = usePostViewer();

  const toggleIsExpanded = useCallback(() => {
    dispatch(setIsToolbarExpanded(!isToolbarExpanded));
  }, [dispatch, isToolbarExpanded]);

  const onMouseEnter = useCallback(() => {
    if (canTouch) return;
    dispatch(setIsMouseOnToolbar(true));
  }, [dispatch]);

  const onMouseLeave = useCallback(() => {
    if (canTouch) return;
    dispatch(setIsMouseOnToolbar(false));
  }, [dispatch]);

  const onContentClick = useCallback(
    (heading: Heading) => {
      if (isToolbarExpanded) dispatch(setCurrentHeading(heading));
      toggleIsExpanded();

      dispatch(setIsToolbarTouched(true));
      debounce(() => dispatch(setIsToolbarTouched(false)), 2000);
    },
    [debounce, dispatch, isToolbarExpanded, toggleIsExpanded]
  );

  return {
    isExpanded: isToolbarExpanded,
    toggleIsExpanded,
    onContentClick,
    onMouseEnter,
    onMouseLeave,
  } as const;
}
