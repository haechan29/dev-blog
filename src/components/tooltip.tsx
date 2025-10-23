'use client';

import { canTouch } from '@/lib/browser';
import clsx from 'clsx';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

type TooltipProps = {
  text: string;
  children: React.ReactNode;
  direction?: 'top' | 'bottom' | 'left' | 'right';
};

type TooltipContentProps = {
  text: string;
  direction: 'top' | 'bottom' | 'left' | 'right';
  isVisible: boolean;
  position: TooltipPosition;
};

type TooltipPosition = {
  top: string;
  left: string;
  translateX: string;
  translateY: string;
};

const arrowClasses = {
  top: 'top-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent border-l-4 border-r-4 border-t-4 border-t-gray-800',
  bottom:
    'bottom-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent border-l-4 border-r-4 border-b-4 border-b-gray-800',
  left: 'left-full top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent border-t-4 border-b-4 border-l-4 border-l-gray-800',
  right:
    'right-full top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent border-t-4 border-b-4 border-r-4 border-r-gray-800',
};

export default function Tooltip({
  text,
  children,
  direction = 'top',
}: TooltipProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [tooltipContent, setTooltipContent] = useState<TooltipContentProps>({
    text,
    direction,
    isVisible: false,
    position: {
      top: '',
      left: '',
      translateX: '',
      translateY: '',
    },
  });
  const containerRef = useRef<HTMLDivElement | null>(null);

  const onMouseEnter = useCallback(() => {
    if (canTouch) return;
    if (!containerRef.current) return;
    const container = containerRef.current;
    const tooltipContentPosition = getTooltipContentPosition({
      container,
      direction,
    });
    setTooltipContent(prev => ({
      ...prev,
      position: tooltipContentPosition,
      isVisible: true,
    }));
  }, [direction]);

  const onMouseLeave = useCallback(() => {
    if (canTouch) return;
    setTooltipContent(prev => ({
      ...prev,
      isVisible: false,
    }));
  }, []);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div
      ref={containerRef}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {children}
      {isMounted &&
        createPortal(<TooltipContent {...tooltipContent} />, document.body)}
    </div>
  );
}

function TooltipContent({
  text,
  direction,
  isVisible,
  position: { top, left, translateX, translateY },
}: TooltipContentProps) {
  return (
    <div
      className={clsx(
        'fixed z-9999',
        'top-[var(--tooltip-top)] left-[var(--tooltip-left)]',
        'translate-x-[var(--tooltip-translate-x)] translate-y-[var(--tooltip-translate-y)]',
        '[display:var(--tooltip-display)]'
      )}
      style={{
        '--tooltip-top': top,
        '--tooltip-left': left,
        '--tooltip-translate-x': translateX,
        '--tooltip-translate-y': translateY,
        '--tooltip-display': isVisible ? 'block' : 'none',
      }}
    >
      <div className='bg-gray-800 text-white text-sm px-3 py-2 rounded-lg shadow-lg whitespace-nowrap'>
        {text}
      </div>
      <div className={clsx('absolute', arrowClasses[direction])}></div>
    </div>
  );
}

function getTooltipContentPosition({
  container,
  direction,
  offset = 8,
}: {
  container: HTMLDivElement;
  direction: 'top' | 'bottom' | 'left' | 'right';
  offset?: number;
}): TooltipPosition {
  const rect = container.getBoundingClientRect();

  const positions = {
    top: {
      top: `${rect.top - offset}px`,
      left: `${rect.left + rect.width / 2}px`,
      translateX: '-50%',
      translateY: '-100%',
    },
    bottom: {
      top: `${rect.bottom + offset}px`,
      left: `${rect.left + rect.width / 2}px`,
      translateX: '-50%',
      translateY: '0',
    },
    left: {
      top: `${rect.top + rect.height / 2}px`,
      left: `${rect.left - offset}px`,
      translateX: '-100%',
      translateY: '-50%',
    },
    right: {
      top: `${rect.top + rect.height / 2}px`,
      left: `${rect.right + offset}px`,
      translateX: '0',
      translateY: '-50%',
    },
  };

  return positions[direction];
}
