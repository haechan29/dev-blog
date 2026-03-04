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
