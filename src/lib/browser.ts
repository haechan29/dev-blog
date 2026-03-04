export const canTouch =
  typeof window !== 'undefined' && 'ontouchstart' in window;
