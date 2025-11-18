'use client';

import { parseYouTubeUrl } from '@/features/post/domain/lib/bgm';
import Heading from '@/features/post/domain/model/heading';
import { Bgm } from '@/features/post/domain/types/bgm';
import { Page } from '@/features/postViewer/domain/types/page';
import useViewerContainerSize from '@/features/postViewer/hooks/useViewerContainerSize';
import useThrottle from '@/hooks/useThrottle';
import {
  setCurrentPageIndex,
  setPages,
} from '@/lib/redux/post/postViewerSlice';
import { AppDispatch } from '@/lib/redux/store';
import { Size } from '@/types/size';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

export default function useViewerPagination() {
  const dispatch = useDispatch<AppDispatch>();
  const throttle = useThrottle();
  const containerSize = useViewerContainerSize();

  useEffect(() => {
    const viewer = document.querySelector('[data-viewer-measurement]');
    if (!viewer || !containerSize) return;

    const pages = measure(containerSize);
    if (pages && pages.length > 0) {
      dispatch(setPages(pages));
      dispatch(setCurrentPageIndex(0));
    }

    const observer = new ResizeObserver(() => {
      throttle(() => measure(containerSize), 300);
    });
    observer.observe(viewer);

    return () => observer.disconnect();
  }, [containerSize, dispatch, throttle]);
}

function measure(containerSize: Size) {
  const viewer = document.querySelector('[data-viewer-measurement]');
  if (!viewer || !containerSize) return;

  const elements = Array.from(viewer.children) as HTMLElement[];

  const totalPages: Page[] = [];
  let currentPageElements: HTMLElement[] = [];
  let currentHeight = 0;
  let pendingHeading: Heading | null = null;
  let pendingBgm: Bgm | null = null;

  elements.forEach(element => {
    if (currentPageElements.length === 0 && isEmptyContent(element)) return;

    if (element.matches('h1, h2, h3, h4, h5, h6')) {
      if (currentPageElements.length > 0) {
        totalPages.push({
          startOffset: Number(currentPageElements[0].dataset.startOffset),
          endOffset: Number(currentPageElements.at(-1)!.dataset.endOffset),
          heading: pendingHeading,
          bgm: pendingBgm,
        });
      }

      currentPageElements = [];
      currentHeight = 0;

      pendingHeading = {
        id: element.id,
        text: element.textContent || '',
        level: parseInt(element.tagName.substring(1)),
      };
      return;
    }

    if (element.matches('[data-bgm]')) {
      if (currentPageElements.length > 0) {
        totalPages.push({
          startOffset: Number(currentPageElements[0].dataset.startOffset),
          endOffset: Number(currentPageElements.at(-1)!.dataset.endOffset),
          heading: pendingHeading,
          bgm: pendingBgm,
        });
      }

      currentPageElements = [];
      currentHeight = 0;

      const youtubeUrl = element.dataset.youtubeUrl;
      if (youtubeUrl === undefined) return;
      const startTime = element.dataset.startTime ?? null;
      const bgm = parseYouTubeUrl(youtubeUrl, startTime);
      pendingBgm = bgm;
      return;
    }

    const { width, height } = element.getBoundingClientRect();
    const scale = Math.min(
      (containerSize.width * 1.5) / width,
      (containerSize.height * 1.5) / height
    );

    if (element.matches('[data-image-with-caption]')) {
      if (currentPageElements.length > 0) {
        totalPages.push({
          startOffset: Number(currentPageElements[0].dataset.startOffset),
          endOffset: Number(currentPageElements.at(-1)!.dataset.endOffset),
          heading: pendingHeading,
          bgm: pendingBgm,
        });

        currentPageElements = [];
        currentHeight = 0;
      }

      const dataCaption = element.dataset.caption;
      if (dataCaption === undefined) return;
      const captions: string[] = JSON.parse(dataCaption);

      captions.forEach(caption => {
        totalPages.push({
          startOffset: Number(element.dataset.startOffset),
          endOffset: Number(element.dataset.endOffset),
          heading: pendingHeading,
          bgm: pendingBgm,
          scale,
          caption,
        });
      });
      return;
    }

    if (height > containerSize.height) {
      if (currentPageElements.length > 0) {
        totalPages.push({
          startOffset: Number(currentPageElements[0].dataset.startOffset),
          endOffset: Number(currentPageElements.at(-1)!.dataset.endOffset),
          heading: pendingHeading,
          bgm: pendingBgm,
        });
      }

      currentPageElements = [];
      currentHeight = 0;

      totalPages.push({
        startOffset: Number(element.dataset.startOffset),
        endOffset: Number(element.dataset.endOffset),
        heading: pendingHeading,
        bgm: pendingBgm,
        scale,
      });
    } else if (height > containerSize.height - currentHeight) {
      totalPages.push({
        startOffset: Number(currentPageElements[0].dataset.startOffset),
        endOffset: Number(currentPageElements.at(-1)!.dataset.endOffset),
        heading: pendingHeading,
        bgm: pendingBgm,
      });

      currentPageElements = [element];
      currentHeight = height;
    } else {
      currentPageElements.push(element);
      currentHeight += height;
    }
  });

  if (
    currentPageElements.length > 0 &&
    currentPageElements.some(element => !isEmptyContent(element))
  ) {
    totalPages.push({
      startOffset: Number(currentPageElements[0].dataset.startOffset),
      endOffset: Number(currentPageElements.at(-1)!.dataset.endOffset),
      heading: pendingHeading,
      bgm: pendingBgm,
    });
  }

  return totalPages;
}

function isEmptyContent(element: Element) {
  if (element.matches('br')) return true;

  if (
    element.matches('div, span, p') &&
    element.textContent.trim() === '' &&
    element.children.length === 0
  ) {
    return true;
  }

  return false;
}
