'use client';

import { cn } from '@/lib/utils';
import clsx from 'clsx';
import { ReactNode, useRef } from 'react';

export default function Sidebar({
  isOpen = false,
  onClose = () => {},
  children,
}: {
  isOpen?: boolean;
  onClose?: () => void;
  children: ReactNode;
}) {
  const startRef = useRef<[number, number] | null>(null);
  const scrollDirectionRef = useRef<'horizontal' | 'vertical' | null>(null);

  const handleTouchStart = (e: React.TouchEvent<HTMLElement>) => {
    const sidebar = e.currentTarget;
    startRef.current = [e.touches[0].clientX, e.touches[0].clientY];
    sidebar.style.transition = 'none';
    scrollDirectionRef.current = null;
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLElement>) => {
    const sidebar = e.currentTarget;

    const start = startRef.current;
    const scrollDirection = scrollDirectionRef.current;
    if (start === null) return;

    const [currentX, currentY] = [e.touches[0].clientX, e.touches[0].clientY];

    if (!scrollDirection) {
      const deltaX = currentX - start[0];
      const deltaY = currentY - start[1];
      scrollDirectionRef.current =
        Math.abs(deltaX) > Math.abs(deltaY) ? 'horizontal' : 'vertical';
    }

    if (scrollDirection === 'horizontal') {
      const translateX = Math.min(currentX - start[0], 0);
      sidebar.style.transform = `translateX(${translateX}px)`;
    }
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLElement>) => {
    const sidebar = e.currentTarget;

    const start = startRef.current;
    if (start === null) return;

    if (scrollDirectionRef.current === 'horizontal') {
      const currentX = e.changedTouches[0].clientX;
      const translateX = Math.min(currentX - start[0], 0);
      const threshold = -sidebar.getBoundingClientRect().width * 0.3;

      if (translateX <= threshold) {
        onClose();
      }
    }

    sidebar.style.transition = '';
    sidebar.style.transform = '';
    startRef.current = null;
    scrollDirectionRef.current = null;
  };

  return (
    <>
      <div
        onClick={onClose}
        className={clsx(
          'fixed inset-0 z-40 bg-black/70 xl:hidden',
          'transition-opacity duration-300 ease-in-out',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
      />

      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className={cn(
          'w-(--sidebar-width) fixed z-50',
          'left-0 top-0 xl:top-(--toolbar-height) bottom-0',
          'flex flex-col bg-white',
          'pb-2 md:pb-3 px-4 md:px-6',
          'transition-transform duration-300 ease-in-out',
          !isOpen && 'max-xl:-translate-x-full'
        )}
      >
        {children}
      </div>
    </>
  );
}
