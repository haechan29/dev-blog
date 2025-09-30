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

  let wasLastElementPaged = false;

  Array.from(postContainer.children)
    .filter(
      child =>
        !excludeClassNames.every(className =>
          child.className.includes(className)
        )
    )
    .forEach(child => {
      const isPagedElement = child.classList.contains('paged');
      const isCaptionElement = child.classList.contains('caption');
      const isHeadingElement = child.matches('h1, h2, h3, h4, h5, h6');
      const hasNonEmptyContent =
        currentPage.length > 0 && !currentPage.every(isEmptyContent);

      if (isPagedElement) {
        if (hasNonEmptyContent) {
          pages.push([...currentPage]);
          currentPage = [];
          currentHeight = 0;
        }

        const pagedClone = child.cloneNode(true) as Element;
        pagedClone.className = 'flex flex-col w-full';

        const wrapper = document.createElement('div');
        wrapper.className =
          'flex flex-1 min-h-0 items-center justify-center *:w-full *:h-full *:object-contain';

        // move child of paged into wrapper
        while (pagedClone.firstChild) {
          wrapper.appendChild(pagedClone.firstChild);
        }
        pagedClone.appendChild(wrapper);

        pages.push([pagedClone]);
      } else if (isCaptionElement && wasLastElementPaged) {
        const sentences = getSentences(child);
        const lastPage = pages.pop()!;
        const pagedElement = lastPage[0];

        sentences.forEach(sentence => {
          const pagedClone = pagedElement.cloneNode(true) as Element;

          const sentenceElement = document.createElement('p');
          sentenceElement.textContent = sentence;
          pagedClone.appendChild(sentenceElement);

          pages.push([pagedClone]);
        });
      } else if (isHeadingElement) {
        // heading belongs to next page if current page has content, otherwise current page.
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

        if (hasNonEmptyContent) {
          pages.push([...currentPage]);
          currentPage = [];
          currentHeight = 0;
        }
      } else {
        const elementHeight = getElementHeight(child);
        const exceedsPageHeight = currentHeight + elementHeight > pageHeight;

        // create new page if current page would overflow or hit heading
        if (exceedsPageHeight && hasNonEmptyContent) {
          pages.push([...currentPage]);
          currentPage = [];
          currentHeight = 0;
        }

        // add non-heading elements to current page
        currentPage.push(child);
        currentHeight += elementHeight;
      }

      wasLastElementPaged = isPagedElement;
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

function getSentences(caption: Element): string[] {
  const text = caption.textContent || '';
  return text
    .split(/[.!?]+\s*/)
    .map(s => s.trim())
    .filter(s => s.length > 0);
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
