export type HeadingPageMapping = {
  headingToPage: Record<string, number>;
  pageToHeading: Record<number, string>;
};

export function getPageByHeading(
  mapping: HeadingPageMapping,
  headingId: string
): number | undefined {
  return mapping.headingToPage[headingId];
}

export function getHeadingByPage(
  mapping: HeadingPageMapping,
  pageIndex: number
): string | undefined {
  const pageIndices = Object.keys(mapping.pageToHeading)
    .map(Number)
    .filter(page => page <= pageIndex)
    .sort((a, b) => b - a);

  return mapping.pageToHeading[pageIndices[0]];
}
