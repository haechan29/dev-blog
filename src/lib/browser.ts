export const supportsFullscreen =
  typeof document !== 'undefined' &&
  document.documentElement.requestFullscreen !== undefined;
