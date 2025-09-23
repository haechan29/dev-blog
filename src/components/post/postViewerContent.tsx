'use client';

import { setCurrentIndex, setTotalPages } from '@/lib/redux/postViewerSlice';
import { AppDispatch, RootState } from '@/lib/redux/store';
import clsx from 'clsx';
import { RefObject, useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

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

    const children = Array.from(container.children);
    const pages: Element[][] = [];
    let currentPage: Element[] = [];
    let currentHeight = 0;

    children.forEach(child => {
      const rect = child.getBoundingClientRect();
      const style = window.getComputedStyle(child);
      const marginTop = parseFloat(style.marginTop) || 0;
      const marginBottom = parseFloat(style.marginBottom) || 0;
      const elementHeight = rect.height + marginTop + marginBottom;

      if (
        currentHeight + elementHeight > window.screen.height - 80 &&
        currentPage.length > 0
      ) {
        pages.push([...currentPage]);
        currentPage = [child];
        currentHeight = elementHeight;
      } else {
        currentPage.push(child);
        currentHeight += elementHeight;
      }
    });

    if (currentPage.length > 0) {
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
        'prose h-screen px-10 xl:mx-72 py-10',
        isProcessing && 'hidden'
      )}
    />
  );
}
