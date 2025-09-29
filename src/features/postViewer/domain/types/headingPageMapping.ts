import { Heading } from '@/features/post/domain/model/post';

export type HeadingPageMapping = {
  headingIdToPage: Record<string, number>;
  pageToHeadings: Record<number, Heading[]>;
};

export function getPageByHeadingId(
  mapping: HeadingPageMapping,
  headingId: string
): number | undefined {
  return mapping.headingIdToPage[headingId];
}

export function getHeadingsByPage(
  mapping: HeadingPageMapping,
  page: number
): Heading[] | undefined {
  const pageIndices = Object.keys(mapping.pageToHeadings)
    .map(Number)
    .filter(p => p <= page)
    .sort((a, b) => b - a);

  return mapping.pageToHeadings[pageIndices[0]];
}
