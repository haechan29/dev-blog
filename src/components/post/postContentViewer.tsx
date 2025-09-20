'use client';

import { useEffect, useRef, useState } from 'react';

export default function PostContentViewer() {
  const [oldPages, setOldPages] = useState<Element[][]>([]);
  const [isProcessing, setIsProcessing] = useState(true);
  const pageRefs = useRef<HTMLDivElement[]>([]);
  const PAGE_HEIGHT = 800;

  useEffect(() => {
    const parseProseSection = () => {
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
          currentHeight + elementHeight > PAGE_HEIGHT &&
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
    };

    const timer = setTimeout(parseProseSection, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    oldPages.forEach((oldPage, index) => {
      const page = pageRefs.current[index];
      if (page && oldPage.length > 0) {
        page.innerHTML = '';
        oldPage.forEach(element => {
          const clonedElement = element.cloneNode(true);
          page.appendChild(clonedElement);
        });
      }
    });
  }, [oldPages]);

  return (
    !isProcessing &&
    oldPages.map((_page, index) => (
      <div
        key={index}
        className='prose border border-gray-200 mb-5 overflow-hidden'
        style={{ height: PAGE_HEIGHT }}
        ref={page => {
          if (page) pageRefs.current[index] = page;
        }}
      />
    ))
  );
}
