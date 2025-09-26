import { Page } from '@/features/postViewer/domain/types/page';

export function parsePostIntoPages({
  postContainer,
  pageHeight,
  excludeClassNames = [],
}: {
  postContainer: Element;
  pageHeight: number;
  excludeClassNames?: string[];
}): Page[] {
  const pages: Page[] = [];
  let currentPage: Page = [];
  let currentHeight = 0;

  for (const child of postContainer.children) {
    const isFiltered = excludeClassNames.some(className =>
      child.className.includes(className)
    );
    if (isFiltered) continue;

    const elementHeight = getElementHeight(child);
    const exceedsPageHeight = currentHeight + elementHeight > pageHeight;
    const isHeadingElement = child.matches('h1, h2, h3, h4, h5, h6');
    const hasNonEmptyContent =
      currentPage.length > 0 && !currentPage.every(isEmptyContent);

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
  }

  const hasNonEmptyContent =
    currentPage.length > 0 && !currentPage.every(isEmptyContent);
  if (hasNonEmptyContent) {
    pages.push(currentPage);
  }

  return pages;
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
