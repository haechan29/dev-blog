export function getToolbarHeightPx(): number {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return 0;
  }

  const value = getComputedStyle(document.documentElement)
    .getPropertyValue('--toolbar-height')
    .trim();
  if (!value) return 0;

  const rem = parseFloat(value);
  if (Number.isNaN(rem)) return 0;

  const rootFontSize = parseFloat(
    getComputedStyle(document.documentElement).fontSize
  );
  return rem * (Number.isNaN(rootFontSize) ? 16 : rootFontSize);
}
