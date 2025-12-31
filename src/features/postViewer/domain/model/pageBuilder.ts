import { parseYouTubeUrl } from '@/features/post/domain/lib/bgm';
import Heading from '@/features/post/domain/model/heading';
import { Bgm } from '@/features/post/domain/types/bgm';
import { Page } from '@/features/postViewer/domain/types/page';

export class PageBuilder {
  private pages: Page[] = [];
  private currentPageElements: HTMLElement[] = [];
  private currentHeight = 0;
  private pendingHeading: Heading | null = null;
  private pendingBgm: Bgm | null = null;

  constructor(private containerHeight: number) {}

  build(elements: HTMLElement[]): Page[] {
    elements.forEach(element => {
      if (
        this.currentPageElements.length === 0 &&
        this.isEmptyContent(element)
      ) {
        return;
      }
      this.process(element);
    });

    this.flushRemaining();
    return this.pages;
  }

  private process(element: HTMLElement) {
    if (element.matches('h1, h2, h3, h4, h5, h6')) {
      this.handleHeading(element);
    } else if (element.matches('[data-bgm]')) {
      this.handleBgm(element);
    } else if (element.matches('[data-image-with-caption]')) {
      this.handleImageWithCaption(element);
    } else if (element.matches('p')) {
      this.handleParagraph(element);
    } else {
      this.handleGenericElement(element);
    }
  }

  private handleHeading(element: HTMLElement) {
    this.flushCurrentPage();

    this.pendingHeading = {
      id: element.id,
      text: element.textContent || '',
      level: parseInt(element.tagName.substring(1)),
    };
  }

  private handleBgm(element: HTMLElement) {
    this.flushCurrentPage();

    const youtubeUrl = element.dataset.youtubeUrl;
    if (!youtubeUrl) return;

    const startTime = element.dataset.startTime ?? null;
    this.pendingBgm = parseYouTubeUrl(youtubeUrl, startTime);
  }

  private handleImageWithCaption(element: HTMLElement) {
    this.flushCurrentPage();

    const dataCaption = element.dataset.caption;
    if (dataCaption === undefined) return;

    dataCaption
      .split(/(?<!\\)#/)
      .map(s => s.replace(/\\#/g, '#'))
      .filter(Boolean)
      .forEach(caption => {
        this.pages.push({
          startOffset: Number(element.dataset.startOffset),
          endOffset: Number(element.dataset.endOffset),
          heading: this.pendingHeading,
          bgm: this.pendingBgm,
          caption,
        });
      });
  }

  private handleParagraph(element: HTMLElement) {
    const { chunks, remainingElements, remainingHeight } =
      this.splitParagraph(element);

    for (const { startOffset, endOffset } of chunks) {
      this.pages.push({
        startOffset: Number(
          this.currentPageElements[0]?.dataset.startOffset ?? startOffset
        ),
        endOffset,
        heading: this.pendingHeading,
        bgm: this.pendingBgm,
      });

      this.currentPageElements = [];
      this.currentHeight = 0;
    }

    this.currentPageElements.push(...remainingElements);
    this.currentHeight = remainingHeight;
  }

  private handleGenericElement(element: HTMLElement) {
    const height = this.calculateElementHeight(element);

    if (height > this.containerHeight) {
      this.flushCurrentPage();
      this.pages.push({
        startOffset: Number(element.dataset.startOffset),
        endOffset: Number(element.dataset.endOffset),
        heading: this.pendingHeading,
        bgm: this.pendingBgm,
      });
    } else if (height > this.containerHeight - this.currentHeight) {
      this.flushCurrentPage();
      this.currentPageElements = [element];
      this.currentHeight = height;
    } else {
      this.currentPageElements.push(element);
      this.currentHeight += height;
    }
  }

  private flushCurrentPage() {
    if (this.currentPageElements.length === 0) return;

    this.pages.push({
      startOffset: Number(this.currentPageElements[0].dataset.startOffset),
      endOffset: Number(this.currentPageElements.at(-1)!.dataset.endOffset),
      heading: this.pendingHeading,
      bgm: this.pendingBgm,
    });

    this.currentPageElements = [];
    this.currentHeight = 0;
  }

  private flushRemaining() {
    if (this.currentPageElements.some(el => !this.isEmptyContent(el))) {
      this.flushCurrentPage();
    }
  }

  private splitParagraph(paragraph: HTMLElement): {
    chunks: { startOffset: number; endOffset: number }[];
    remainingElements: HTMLElement[];
    remainingHeight: number;
  } {
    const leaves = Array.from(
      paragraph.querySelectorAll(
        '[data-start-offset]:not(:has([data-start-offset]))'
      )
    ) as HTMLElement[];

    const chunks: { startOffset: number; endOffset: number }[] = [];
    let chunkStartIndex = 0;
    let height = this.currentHeight;

    leaves.forEach((leaf, index) => {
      const leafHeight = leaf.offsetHeight;

      if (height + leafHeight > this.containerHeight) {
        if (index > 0) {
          chunks.push({
            startOffset: Number(leaves[chunkStartIndex].dataset.startOffset),
            endOffset: Number(leaves[index - 1].dataset.endOffset),
          });
          chunkStartIndex = index;
        }
        height = 0;
      }
      height += leafHeight;
    });

    return {
      chunks,
      remainingElements: leaves.slice(chunkStartIndex),
      remainingHeight: height,
    };
  }

  private calculateElementHeight(element: HTMLElement): number {
    const { marginTop, marginBottom } = window.getComputedStyle(element);
    return (
      element.offsetHeight +
      (parseFloat(marginTop) || 0) +
      (parseFloat(marginBottom) || 0)
    );
  }

  private isEmptyContent(element: Element): boolean {
    if (element.matches('br')) return true;

    if (
      element.matches('div, span, p') &&
      element.textContent?.trim() === '' &&
      element.children.length === 0
    ) {
      return true;
    }

    return false;
  }
}
