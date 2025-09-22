'use client';

import { RootState } from '@/lib/redux/store';
import clsx from 'clsx';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

export default function PostViewerContent() {
  const [oldPages, setOldPages] = useState<Element[][]>([]);
  const [isProcessing, setIsProcessing] = useState(true);
  const pageRef = useRef<HTMLDivElement | null>(null);

  const postViewer = useSelector((state: RootState) => state.postViewer);

  const parseProseSection = useCallback(() => {
    const container = document.querySelector('.prose');
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
        currentHeight + elementHeight > window.innerHeight &&
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

    setOldPages(pages);
    setIsProcessing(false);
  }, []);

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
  }, [oldPages, postViewer.currentIndex]);

  return (
    <div
      ref={pageRef}
      className={clsx(
        'prose flex flex-col flex-1',
        isProcessing && 'opacity-0'
      )}
    />
  );
}
