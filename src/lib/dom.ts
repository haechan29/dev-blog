import { Size } from '@/types/size';
import clsx from 'clsx';

/**
 * get element's content size excluding padding, border, and margin
 */
export function getContentSize(element: HTMLElement): Size {
  const style = getComputedStyle(element);
  const width =
    element.clientWidth -
    parseFloat(style.paddingLeft) -
    parseFloat(style.paddingRight);
  const height =
    element.clientHeight -
    parseFloat(style.paddingTop) -
    parseFloat(style.paddingBottom);
  return {
    width,
    height,
  };
}

/**
 * get the intrinsic size of an element by temporarily rendering it
 */
export function getIntrinsicSize(element: HTMLElement): Size {
  const clone = element.cloneNode(true) as HTMLElement;
  const container = document.createElement('div');
  container.className = 'absolute flex invisible';
  container.appendChild(clone);
  document.body.appendChild(container);
  const { width, height } = clone.getBoundingClientRect();
  document.body.removeChild(container);

  return { width, height };
}

export function remToPx(rem: number): number {
  return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
}

export function createRipple(
  clientX: number,
  clientY: number,
  container: HTMLElement = document.body
) {
  if (typeof document === 'undefined') return;

  const rippleElement = document.createElement('div');
  rippleElement.className = clsx(
    'w-[100px] h-[100px] fixed z-[9999] top-[var(--ripple-top)] left-[var(--ripple-left)] -translate-y-1/2 -translate-x-1/2',
    'animate-ripple rounded-full bg-gray-300'
  );
  rippleElement.style.setProperty('--ripple-top', `${clientY}px`);
  rippleElement.style.setProperty('--ripple-left', `${clientX}px`);
  rippleElement.addEventListener('animationend', () => {
    rippleElement.remove();
  });
  container.appendChild(rippleElement);
}
