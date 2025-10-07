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
