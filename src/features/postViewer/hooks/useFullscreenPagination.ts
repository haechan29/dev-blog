'use client';

import useViewerContainerSize from '@/features/postViewer/hooks/useViewerContainerSize';
import { useEffect, useState } from 'react';

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
  const containerSize = useViewerContainerSize();

  useEffect(() => {
    const postContent = document.querySelector('[data-post-content]');
    if (!postContent || !containerSize) return;

    const elements = Array.from(postContent.children) as HTMLElement[];

    const calculatedPages: Page[] = [];
    let currentPageElements: HTMLElement[] = [];
    let currentHeight = 0;

    elements.forEach(element => {
      if (currentPageElements.length === 0 && isEmptyContent(element)) return;

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
  }, [containerSize, rawContent]);

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
