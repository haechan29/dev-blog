import { Heading } from '@/features/post/domain/model/post';
import { HeadingPageMapping } from '@/features/postViewer/domain/types/headingPageMapping';
import { Page } from '@/features/postViewer/domain/types/page';

/**
 * Parses post into pages and creates heading-page mapping.
 * - Headings (h1-h6) trigger new pages and are not included in pages
 * - New page created when content exceeds page height
 */
export function parsePost({
  postContainer,
  pageHeight,
  excludeClassNames = [],
}: {
  postContainer: Element;
  pageHeight: number;
  excludeClassNames?: string[];
}): {
  pages: Page[];
  headingPageMapping: HeadingPageMapping;
} {
  const headingIdToPage: Record<string, number> = {};
  const pageToHeadings: Record<number, Heading[]> = {};

  const pages: Page[] = [];
  let currentPage: Page = [];
  let currentHeight = 0;

  Array.from(postContainer.children)
    .filter(
      child =>
        !excludeClassNames.every(className =>
          child.className.includes(className)
        )
    )
    .forEach(child => {
      const elementHeight = getElementHeight(child);
      const exceedsPageHeight = currentHeight + elementHeight > pageHeight;
      const isHeadingElement = child.matches('h1, h2, h3, h4, h5, h6');
      const hasNonEmptyContent =
        currentPage.length > 0 && !currentPage.every(isEmptyContent);

      // heading belongs to next page if current page has content, otherwise current page.
      if (isHeadingElement) {
        const pageIndex = hasNonEmptyContent ? pages.length + 1 : pages.length;
        const level = parseInt(child.tagName.substring(1));

        headingIdToPage[child.id] = pageIndex;
        if (!pageToHeadings[pageIndex]) {
          pageToHeadings[pageIndex] = [];
        }
        pageToHeadings[pageIndex].push({
          id: child.id,
          text: child.textContent,
          level,
        });
      }

      // create new page if current page would overflow or hit heading
      if ((exceedsPageHeight || isHeadingElement) && hasNonEmptyContent) {
        pages.push([...currentPage]);
        currentPage = [];
        currentHeight = 0;
      }

      // add non-heading elements to current page
      if (!isHeadingElement) {
        currentPage.push(child);
        currentHeight += elementHeight;
      }
    });

  const hasNonEmptyContent =
    currentPage.length > 0 && !currentPage.every(isEmptyContent);
  if (hasNonEmptyContent) {
    pages.push(currentPage);
  }

  return {
    pages,
    headingPageMapping: { headingIdToPage, pageToHeadings },
  };
}

function getElementHeight(element: Element) {
  const rect = element.getBoundingClientRect();
  const style = window.getComputedStyle(element);
  const marginTop = parseFloat(style.marginTop) || 0;
  const marginBottom = parseFloat(style.marginBottom) || 0;
  return rect.height + marginTop + marginBottom;
}

function isEmptyContent(element: Element) {
  if (element.matches('br')) return true;

  if (
    element.matches('div, span, p') &&
    element.textContent.trim() === '' &&
    element.children.length === 0
  ) {
    return true;
  }

  return false;
}
