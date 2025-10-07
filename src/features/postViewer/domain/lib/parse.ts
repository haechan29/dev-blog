import Heading from '@/features/post/domain/model/heading';
import { HeadingPageMapping } from '@/features/postViewer/domain/types/headingPageMapping';
import { Page } from '@/features/postViewer/domain/types/page';
import { getIntrinsicSize } from '@/lib/dom';

/**
 * Parses post into pages and creates heading-page mapping.
 * - Headings (h1-h6) trigger new pages and are not included in pages
 * - New page created when content exceeds page height
 */
export function parsePost({
  postContainer,
  containerWidth,
  containerHeight,
  excludeClassNames = [],
}: {
  postContainer: Element;
  containerWidth: number;
  containerHeight: number;
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

        const pagedElement = createPagedElement(
          child,
          containerWidth,
          containerHeight
        );
        pages.push([pagedElement]);
      } else if (isCaptionElement && wasLastElementPaged) {
        const lastPage = pages.pop()!;
        const pagedElement = lastPage[0];

        // split caption into sentences and create separate page for each
        const sentences = getSentences(child);
        sentences.forEach(sentence => {
          const pagedElementClone = pagedElement.cloneNode(true) as HTMLElement;
          const captionElement = createCaptionElement(child, sentence);

          pages.push([pagedElementClone, captionElement]);
        });
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
        const exceedsPageHeight =
          currentHeight + elementHeight > containerHeight;

        // create new page if current page would overflow or hit heading
        if (exceedsPageHeight && hasNonEmptyContent) {
          pages.push([...currentPage]);
          currentPage = [];
          currentHeight = 0;
        }

        const shouldAddElement =
          currentPage.length !== 0 || !isEmptyContent(child);
        if (shouldAddElement) {
          currentPage.push(child);
          currentHeight += elementHeight;
        }
      }

      wasLastElementPaged = isPagedElement;
    });

  const hasNonEmptyContent =
    currentPage.length > 0 && !currentPage.every(isEmptyContent);
  if (hasNonEmptyContent) {
    pages.push(currentPage);
  }

  const clonedPages = pages.map(page =>
    page.map(element => element.cloneNode(true) as Element)
  );

  return {
    pages: clonedPages,
    headingPageMapping: { headingIdToPage, pageToHeadings },
  };
}

function createPagedElement(
  element: Element,
  containerWidth: number,
  containerHeight: number
): Element {
  const pagedClone = element.cloneNode(false) as HTMLElement;
  pagedClone.className += ' w-full h-full flex justify-center items-center';

  const child = element.firstElementChild as HTMLElement;
  if (child) {
    const clone = child.cloneNode(true) as HTMLElement;

    const { width, height } = getIntrinsicSize(clone);
    const scale = Math.min(containerWidth / width, containerHeight / height);
    clone.style.setProperty('--scale', scale.toString());
    clone.className += ' scale-[var(--scale)] origin-center';

    pagedClone.appendChild(clone);
  }
  return pagedClone;
}

function createCaptionElement(element: Element, sentence: string) {
  const captionElement = document.createElement('div');
  captionElement.className =
    'absolute left-0 right-0 bottom-6 flex justify-center';

  const content = document.createElement('div');
  content.className =
    'bg-black/70 text-white text-center break-keep text-balance px-2 py-1';
  content.textContent = sentence;
  captionElement.appendChild(content);
  return captionElement;
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
