import Heading from '@/features/post/domain/model/heading';
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

  function registerHeading(element: Element, pageIndex: number) {
    const level = parseInt(element.tagName.substring(1));

    headingIdToPage[element.id] = pageIndex;
    if (!pageToHeadings[pageIndex]) {
      pageToHeadings[pageIndex] = [];
    }
    pageToHeadings[pageIndex].push({
      id: element.id,
      text: element.textContent,
      level,
    });
  }

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
        // save current page before creating paged element
        if (hasNonEmptyContent) {
          pages.push([...currentPage]);
          currentPage = [];
          currentHeight = 0;
        }

        const pagedElement = createPagedElement(child);
        pages.push([pagedElement]);
      } else if (isCaptionElement && wasLastElementPaged) {
        // split caption into sentences and create separate page for each
        const sentences = getSentences(child);

        const lastPage = pages.pop()!;
        const pagedElement = lastPage[0];

        const pagedElements = createPagedElementsWithCaption(
          pagedElement,
          sentences
        );
        pagedElements.forEach(pagedElement => pages.push([pagedElement]));
      } else if (isHeadingElement) {
        // heading belongs to next page if current page has content, otherwise current page.
        const pageIndex = hasNonEmptyContent ? pages.length + 1 : pages.length;
        registerHeading(child, pageIndex);

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

function createPagedElement(element: Element): Element {
  const clone = element.cloneNode(true) as Element;
  clone.className = 'flex flex-col w-full';

  const wrapper = document.createElement('div');
  wrapper.className =
    'flex flex-1 min-h-0 items-center justify-center *:w-full *:h-full *:object-contain';

  // wrap original content for proper flex layout
  while (clone.firstChild) {
    wrapper.appendChild(clone.firstChild);
  }
  clone.appendChild(wrapper);
  return clone;
}

function createPagedElementsWithCaption(
  pagedElement: Element,
  captions: string[]
): Element[] {
  return captions.map(caption => {
    const pagedClone = pagedElement.cloneNode(true) as Element;
    const sentenceElement = document.createElement('p');
    sentenceElement.textContent = caption;
    pagedClone.appendChild(sentenceElement);
    return pagedClone;
  });
}

function getSentences(element: Element): string[] {
  const text = element.textContent || '';
  return text
    .split(/(?<=[.!?])\s+/) // split sentences by punctuation marks (., !, ?)
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
