'use client';

import Heading from '@/features/post/domain/model/heading';
import usePostToolbar from '@/features/post/hooks/usePostToolbar';
import { setCurrentHeading } from '@/lib/redux/post/postPositionSlice';
import { setIsExpanded } from '@/lib/redux/post/postToolbarSlice';
import { AppDispatch } from '@/lib/redux/store';
import { scrollIntoElement } from '@/lib/scroll';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

export default function usePostToolbarHandler() {
  const dispatch = useDispatch<AppDispatch>();
  const postToolbar = usePostToolbar();

  const onContentClick = useCallback(
    (heading: Heading) => {
      if (postToolbar.mode === 'collapsed') {
        dispatch(setIsExpanded(true));
      }
      if (postToolbar.mode === 'expanded') {
        const element = document.getElementById(heading.id);
        if (element) {
          scrollIntoElement(
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
    onContentClick,
    onExpandButtonClick,
  } as const;
}
