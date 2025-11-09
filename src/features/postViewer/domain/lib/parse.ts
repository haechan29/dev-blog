import Heading from '@/features/post/domain/model/heading';
import { HeadingPageMapping } from '@/features/postViewer/domain/types/headingPageMapping';
import { Page } from '@/features/postViewer/domain/types/page';
import { getIntrinsicSize } from '@/lib/dom';
import { cn } from '@/lib/utils';

/**
 * Parses post into pages and creates heading-page mapping.
 * - Headings (h1-h6) trigger new pages and are not included in pages
 * - New page created when content exceeds page height
 */
export function parsePost({
  postElement,
  containerWidth,
  containerHeight,
  excludeClassNames = [],
}: {
  postElement: Element;
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

  Array.from(postElement.children)
    .filter(child => !excludeClassNames.includes(child.className))
    .forEach(child => {
      const isImageWithCaption = child.matches('[data-image-with-caption]');
      const isHeadingElement = child.matches('h1, h2, h3, h4, h5, h6');
      const hasNonEmptyContent =
        currentPage.length > 0 && !currentPage.every(isEmptyContent);

      if (isImageWithCaption) {
        // save current page before creating new pages
        if (hasNonEmptyContent) {
          pages.push([...currentPage]);
          currentPage = [];
          currentHeight = 0;
        }

        const imagePage = createImagePage(
          child,
          containerWidth,
          containerHeight
        );

        const caption = child.getAttribute('data-caption');
        if (caption) {
          const newCaptions = caption
            .replace(/\\#/g, '__ESCAPED_HASH__')
            .replace(/#/g, '')
            .replace(/__ESCAPED_HASH__/g, '#')
            .split('\n');

          newCaptions.forEach(caption => {
            const imagePageClone = imagePage.cloneNode(true) as HTMLElement;
            const captionElement = createCaptionElement(caption);

            pages.push([imagePageClone, captionElement]);
          });
        } else {
          pages.push([imagePage]);
        }
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

function createImagePage(
  element: Element,
  containerWidth: number,
  containerHeight: number
): Element {
  const imageClone = element.cloneNode(false) as HTMLElement;
  imageClone.className = cn(
    'w-full h-full flex justify-center items-center',
    imageClone.className
  );

  const child = element.firstElementChild as HTMLElement;
  if (child) {
    const clone = child.cloneNode(true) as HTMLElement;

    const { width, height } = getIntrinsicSize(clone);
    const scale = Math.min(containerWidth / width, containerHeight / height);
    clone.style.setProperty('--scale', scale.toString());
    clone.className = cn('scale-[var(--scale)] origin-center', clone.className);

    imageClone.appendChild(clone);
  }
  return imageClone;
}

function createCaptionElement(sentence: string) {
  const captionElement = document.createElement('div');
  captionElement.className =
    'absolute left-0 right-0 bottom-0 flex justify-center';

  const content = document.createElement('div');
  content.className =
    'bg-black/70 text-white text-center break-keep wrap-anywhere text-balance px-2 py-1';
  content.textContent = sentence;
  captionElement.appendChild(content);
  return captionElement;
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
