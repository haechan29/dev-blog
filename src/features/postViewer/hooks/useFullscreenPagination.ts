'use client';

import useViewerContainerSize from '@/features/postViewer/hooks/useViewerContainerSize';
import useThrottle from '@/hooks/useThrottle';
import { useCallback, useEffect, useState } from 'react';

type Page = {
  startOffset: number;
  endOffset: number;
};

export default function useFullscreenPagination({
  rawContent,
}: {
  rawContent: string;
}) {
  const [pages, setPages] = useState<Page[]>([]);
  const throttle = useThrottle();
  const containerSize = useViewerContainerSize();

  const measure = useCallback(() => {
    const postContent = document.querySelector('[data-post-content]');
    if (!postContent || !containerSize) return;

    const elements = Array.from(postContent.children) as HTMLElement[];

    const calculatedPages: Page[] = [];
    let currentPageElements: HTMLElement[] = [];
    let currentHeight = 0;

    elements.forEach(element => {
      if (currentPageElements.length === 0 && isEmptyContent(element)) return;
      if (element.hasAttribute('data-caption')) return;

      const height = element.getBoundingClientRect().height;

      if (
        currentHeight + height > containerSize.height &&
        currentPageElements.length > 0
      ) {
        calculatedPages.push({
          startOffset: Number(currentPageElements[0].dataset.startOffset),
          endOffset: Number(currentPageElements.at(-1)!.dataset.endOffset),
        });
        currentPageElements = [element];
        currentHeight = height;
      } else {
        currentPageElements.push(element);
        currentHeight += height;
      }
    });

    if (currentPageElements.length > 0) {
      calculatedPages.push({
        startOffset: Number(currentPageElements[0].dataset.startOffset),
        endOffset: Number(currentPageElements.at(-1)!.dataset.endOffset),
      });
    }

    setPages(calculatedPages);
  }, [containerSize]);

  useEffect(() => {
    const postContent = document.querySelector('[data-post-content]');
    if (!postContent) return;

    measure();

    const observer = new ResizeObserver(() => throttle(measure, 300));
    observer.observe(postContent);

    return () => observer.disconnect();
  }, [rawContent, measure, throttle]);

  return { pages };
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
