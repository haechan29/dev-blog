'use client';

import Heading from '@/features/post/domain/model/heading';
import usePostToolbar from '@/features/post/hooks/usePostToolbar';
import { setCurrentHeading } from '@/lib/redux/postPositionSlice';
import { setIsVisible } from '@/lib/redux/postSidebarSlice';
import { setIsExpanded } from '@/lib/redux/postToolbarSlice';
import { AppDispatch } from '@/lib/redux/store';
import { scrollToElement } from '@/lib/scroll';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

export default function usePostToolbarHandler() {
  const dispatch = useDispatch<AppDispatch>();
  const postToolbar = usePostToolbar();

  const onSidebarButtonClick = useCallback(
    () => dispatch(setIsVisible(true)),
    [dispatch]
  );

  const onContentClick = useCallback(
    (heading: Heading) => {
      if (postToolbar.mode === 'collapsed') {
        dispatch(setIsExpanded(true));
      }
      if (postToolbar.mode === 'expanded') {
        const element = document.getElementById(heading.id);
        if (element) {
          scrollToElement(
            element,
            {
              behavior: 'smooth',
              block: 'start',
            },
            () => {
              dispatch(setCurrentHeading(heading));
              dispatch(setIsExpanded(false));
            }
          );
        }
      }
    },
    [dispatch, postToolbar.mode]
  );

  const onExpandButtonClick = useCallback(
    () => dispatch(setIsExpanded(postToolbar.mode !== 'expanded')),
    [dispatch, postToolbar.mode]
  );

  return {
    onSidebarButtonClick,
    onContentClick,
    onExpandButtonClick,
  } as const;
}
