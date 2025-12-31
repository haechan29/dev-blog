'use client';

import { PageBuilder } from '@/features/postViewer/domain/model/pageBuilder';
import useDebounce from '@/hooks/useDebounce';
import {
  setCurrentPageIndex,
  setPages,
} from '@/lib/redux/post/postViewerSlice';
import { AppDispatch } from '@/lib/redux/store';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

export default function useViewerPagination() {
  const dispatch = useDispatch<AppDispatch>();
  const debounce = useDebounce();

  useEffect(() => {
    const viewer = document.querySelector('[data-viewer]');
    const viewerMeasure = document.querySelector('[data-viewer-measurement]');
    if (!viewer || !viewerMeasure) return;

    const observer = new ResizeObserver(() => {
      debounce(() => {
        const containerHeight = (viewerMeasure as HTMLElement).offsetHeight;
        const elements = Array.from(viewerMeasure.children) as HTMLElement[];

        const pages = new PageBuilder(containerHeight).build(elements);
        if (pages && pages.length > 0) {
          dispatch(setPages(pages));
          dispatch(setCurrentPageIndex(0));
        }
      }, 100);
    });
    observer.observe(viewer);

    return () => observer.disconnect();
  }, [debounce, dispatch]);
}
