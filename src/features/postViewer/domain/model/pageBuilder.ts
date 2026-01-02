import { parseYouTubeUrl } from '@/features/post/domain/lib/bgm';
import Heading from '@/features/post/domain/model/heading';
import { Bgm } from '@/features/post/domain/types/bgm';
import { Page } from '@/features/postViewer/domain/types/page';

interface OffsetRange {
  startOffset: number;
  endOffset: number;
}

export class PageBuilder {
  private pages: Page[] = [];
  private pageRanges: OffsetRange[] = [];
  private isPageEmpty = true;
  private pageHeight = 0;
  private pendingHeading: Heading | null = null;
  private pendingBgm: Bgm | null = null;

  constructor(private containerHeight: number) {}

  build(elements: HTMLElement[]): Page[] {
    elements.forEach(element => {
      if (this.pageRanges.length === 0 && this.isEmptyContent(element)) {
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
    if (!dataCaption) {
      this.pages.push({
        startOffset: Number(element.dataset.startOffset),
        endOffset: Number(element.dataset.endOffset),
        heading: this.pendingHeading,
        bgm: this.pendingBgm,
      });
      return;
    }

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

  private handleParagraph(paragraph: HTMLElement) {
    const leaves = Array.from(
      paragraph.querySelectorAll(
        '[data-start-offset]:not(:has([data-start-offset]))'
      )
    ) as HTMLElement[];

    leaves.forEach(leaf => {
      const isText =
        leaf.matches('span') && leaf.firstChild?.nodeType === Node.TEXT_NODE;

      if (!isText) {
        this.handleGenericElement(leaf);
        return;
      }

      const leafStartOffset = Number(leaf.dataset.startOffset);
      const leafEndOffset = Number(leaf.dataset.endOffset);
      let leafHeight = this.calculateElementHeight(leaf);
      let textStartIndex = 0;

      const textNode = leaf.firstChild as Text;

      while (this.pageHeight + leafHeight > this.containerHeight) {
        const availableHeight = this.containerHeight - this.pageHeight;
        const splitIndex = this.findSplitIndex(
          textNode,
          availableHeight,
          textStartIndex
        );

        if (splitIndex === textStartIndex) {
          this.flushCurrentPage();
          continue;
        }

        this.pages.push({
          startOffset:
            this.pageRanges[0]?.startOffset ?? leafStartOffset + textStartIndex,
          endOffset: leafStartOffset + splitIndex,
          heading: this.pendingHeading,
          bgm: this.pendingBgm,
        });

        this.pageRanges = [];
        this.pageHeight = 0;
        this.isPageEmpty = true;
        textStartIndex = splitIndex;
        leafHeight -= availableHeight;
      }

      if (leafStartOffset + textStartIndex < leafEndOffset) {
        this.pageRanges.push({
          startOffset: leafStartOffset + textStartIndex,
          endOffset: leafEndOffset,
        });
        this.pageHeight += leafHeight;
        this.isPageEmpty = false;
      }
    });
  }

  private handleGenericElement(element: HTMLElement) {
    const height = this.calculateElementHeight(element);
    const range: OffsetRange = {
      startOffset: Number(element.dataset.startOffset),
      endOffset: Number(element.dataset.endOffset),
    };

    if (height > this.containerHeight) {
      this.flushCurrentPage();
      this.pages.push({
        ...range,
        heading: this.pendingHeading,
        bgm: this.pendingBgm,
      });
    } else if (height > this.containerHeight - this.pageHeight) {
      this.flushCurrentPage();
      this.pageRanges = [range];
      this.pageHeight = height;
      this.isPageEmpty = this.isEmptyContent(element);
    } else {
      this.pageRanges.push(range);
      this.pageHeight += height;
      if (!this.isEmptyContent(element)) {
        this.isPageEmpty = false;
      }
    }
  }

  private flushCurrentPage() {
    if (this.pageRanges.length === 0) return;

    this.pages.push({
      startOffset: this.pageRanges[0].startOffset,
      endOffset: this.pageRanges.at(-1)!.endOffset,
      heading: this.pendingHeading,
      bgm: this.pendingBgm,
    });

    this.pageRanges = [];
    this.isPageEmpty = true;
    this.pageHeight = 0;
  }

  private flushRemaining() {
    if (!this.isPageEmpty) {
      this.flushCurrentPage();
    }
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

  private findSplitIndex(
    textNode: Text,
    targetHeight: number,
    startIndex: number
  ) {
    const range = document.createRange();
    const text = textNode.textContent || '';

    let left = startIndex;
    let right = text.length;
    let result = startIndex;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);

      range.setStart(textNode, startIndex);
      range.setEnd(textNode, mid);

      const height = range.getBoundingClientRect().height;

      if (height <= targetHeight) {
        result = mid;
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }

    return result;
  }
}
