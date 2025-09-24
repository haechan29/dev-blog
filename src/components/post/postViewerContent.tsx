'use client';

import { setCurrentIndex, setTotalPages } from '@/lib/redux/postViewerSlice';
import { AppDispatch, RootState } from '@/lib/redux/store';
import clsx from 'clsx';
import { RefObject, useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const FULLSCREEN_SCALE = 1.5;

export default function PostViewerContent({
  pageRef,
}: {
  pageRef: RefObject<HTMLDivElement | null>;
}) {
  const [oldPages, setOldPages] = useState<Element[][]>([]);
  const [isProcessing, setIsProcessing] = useState(true);

  const dispatch = useDispatch<AppDispatch>();
  const postViewer = useSelector((state: RootState) => state.postViewer);

  const parseProseSection = useCallback(() => {
    const container = document.querySelector('.post-content');
    if (!container) return;

    const children = Array.from(container.children).filter(
      child => !child.matches('.hide-fullscreen')
    );
    const pages: Element[][] = [];
    let currentPage: Element[] = [];
    let currentHeight = 0;

    children.forEach(child => {
      const isHeadingElement = child.matches('h1, h2, h3, h4, h5, h6');
      const hasContent =
        currentPage.length > 0 && !currentPage.every(isEmptyContent);

      const elementHeight = getElementHeight(child);
      const exceedsPageHeight =
        currentHeight + elementHeight >
        (window.screen.height - 80) / FULLSCREEN_SCALE;

      if ((isHeadingElement || exceedsPageHeight) && hasContent) {
        pages.push([...currentPage]);
        currentPage = [];
        currentHeight = 0;
      }

      if (!isHeadingElement) {
        currentPage.push(child);
        currentHeight += elementHeight;
      }
    });

    const hasContent = !currentPage.every(isEmptyContent);
    if (hasContent) {
      pages.push(currentPage);
    }

    dispatch(setTotalPages(pages.length));
    dispatch(setCurrentIndex(0));

    setOldPages(pages);
    setIsProcessing(false);
  }, [dispatch]);

  useEffect(() => {
    const timer = setTimeout(parseProseSection, 100);
    return () => clearTimeout(timer);
  }, [parseProseSection]);

  useEffect(() => {
    const page = pageRef.current;
    const oldPage = oldPages[postViewer.currentIndex];

    if (page && oldPage) {
      page.innerHTML = '';
      oldPage.forEach(element => {
        const clonedElement = element.cloneNode(true);
        page.appendChild(clonedElement);
      });
    }
  }, [oldPages, pageRef, postViewer.currentIndex]);

  return (
    <div
      ref={pageRef}
      className={clsx(
        'prose fullscreen w-[calc((100vw-20rem)/var(--fullscreen-scale))] h-screen mx-auto py-10',
        'scale-[var(--fullscreen-scale)] origin-top',
        isProcessing && 'hidden'
      )}
      style={{ '--fullscreen-scale': FULLSCREEN_SCALE }}
    />
  );
}

function getElementHeight(element: Element) {
  const rect = element.getBoundingClientRect();
  const style = window.getComputedStyle(element);
  const marginTop = parseFloat(style.marginTop) || 0;
  const marginBottom = parseFloat(style.marginBottom) || 0;
  return rect.height + marginTop + marginBottom;
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
