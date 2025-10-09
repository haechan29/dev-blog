export const supportsFullscreen =
  typeof document !== 'undefined' &&
  document.documentElement.requestFullscreen !== undefined;

export const canTouch =
  typeof window !== 'undefined' && 'ontouchstart' in window;
