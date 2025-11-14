'use client';

import Heading from '@/features/post/domain/model/heading';
import useViewerContainerSize from '@/features/postViewer/hooks/useViewerContainerSize';
import useThrottle from '@/hooks/useThrottle';
import { useCallback, useEffect, useState } from 'react';

type Page = {
  startOffset: number;
  endOffset: number;
  heading: Heading | null;
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

    const totalPages: Page[] = [];
    let currentPageElements: HTMLElement[] = [];
    let currentHeight = 0;
    let pendingHeading: Heading | null = null;

    elements.forEach(element => {
      if (currentPageElements.length === 0 && isEmptyContent(element)) return;

      if (element.matches('h1, h2, h3, h4, h5, h6')) {
        if (currentPageElements.length > 0) {
          totalPages.push({
            startOffset: Number(currentPageElements[0].dataset.startOffset),
            endOffset: Number(currentPageElements.at(-1)!.dataset.endOffset),
            heading: pendingHeading,
          });
        }

        pendingHeading = {
          id: element.id,
          text: element.textContent || '',
          level: parseInt(element.tagName.substring(1)),
        };
        currentPageElements = [];
        currentHeight = 0;
        return;
      }

      const height = element.getBoundingClientRect().height;

      if (
        currentHeight + height > containerSize.height &&
        currentPageElements.length > 0
      ) {
        totalPages.push({
          startOffset: Number(currentPageElements[0].dataset.startOffset),
          endOffset: Number(currentPageElements.at(-1)!.dataset.endOffset),
          heading: pendingHeading,
        });
        pendingHeading = null;
        currentPageElements = [element];
        currentHeight = height;
      } else {
        currentPageElements.push(element);
        currentHeight += height;
      }
    });

    if (currentPageElements.length > 0) {
      totalPages.push({
        startOffset: Number(currentPageElements[0].dataset.startOffset),
        endOffset: Number(currentPageElements.at(-1)!.dataset.endOffset),
        heading: pendingHeading,
      });
    }

    setPages(totalPages);
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
