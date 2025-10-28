import { Size } from '@/types/size';

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

export function createRipple({
  clientX,
  clientY,
  currentTarget: target,
  rippleColor = 'rgba(0,0,0,0.3)',
}: {
  clientX: number;
  clientY: number;
  currentTarget: HTMLElement;
  rippleColor?: string;
}) {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  const { width, height, top, left } = target.getBoundingClientRect();
  const { borderRadius } = window.getComputedStyle(target);
  const container = document.createElement('div');
  container.className = 'fixed z-[1000] overflow-hidden';
  Object.assign(container.style, {
    width: `${width}px`,
    height: `${height}px`,
    top: `${top}px`,
    left: `${left}px`,
    borderRadius,
  });

  const rippleSize = Math.sqrt(width ** 2 + height ** 2) * 2;
  const rippleElement = document.createElement('div');
  rippleElement.className =
    'absolute z-[2000] animate-ripple rounded-full -translate-y-1/2 -translate-x-1/2';
  Object.assign(rippleElement.style, {
    width: `${rippleSize}px`,
    height: `${rippleSize}px`,
    top: `${clientY - top}px`,
    left: `${clientX - left}px`,
    backgroundColor: rippleColor,
  });
  rippleElement.addEventListener('animationend', () => {
    container.remove();
  });

  container.appendChild(rippleElement);
  document.body.appendChild(container);
}
