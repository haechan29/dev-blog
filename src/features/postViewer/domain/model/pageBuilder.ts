import Heading from '@/features/post/domain/model/heading';
import { Page } from '@/features/postViewer/domain/types/page';

interface OffsetRange {
  startOffset: number;
  endOffset: number;
}

export class PageBuilder {
  private pages: Page[] = [];
  private pageRanges: OffsetRange[] = [];
  private isPageEmpty = true;
  private baseTop: number | null = null;
  private pendingHeading: Heading | null = null;
  private pendingBgm: string | null = null;

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

    const src = element.dataset.src;
    if (!src) return;

    this.pendingBgm = src;
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
    const children = Array.from(paragraph.children) as HTMLElement[];

    children.forEach(child => {
      const isText =
        child.matches('span') &&
        child.childNodes.length === 1 &&
        child.childNodes[0].nodeType === Node.TEXT_NODE;

      if (!isText) {
        this.handleGenericElement(child);
        return;
      }

      const { top, bottom } = child.getBoundingClientRect();
      const leafStartOffset = Number(child.dataset.startOffset);
      const leafEndOffset = Number(child.dataset.endOffset);
      const textNode = child.firstChild as Text;

      if (this.baseTop === null) {
        this.baseTop = top;
      }

      let currentTop = top;
      let textStartIndex = 0;

      while (bottom - this.baseTop > this.containerHeight) {
        const availableHeight =
          this.containerHeight - (currentTop - this.baseTop);
        const splitIndex = this.findSplitIndex(
          textNode,
          availableHeight,
          textStartIndex
        );

        if (splitIndex === textStartIndex) {
          this.flushCurrentPage();
          this.baseTop = currentTop;
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
        this.isPageEmpty = true;
        currentTop += availableHeight;
        this.baseTop = currentTop;
        textStartIndex = splitIndex;
      }

      if (leafStartOffset + textStartIndex < leafEndOffset) {
        this.pageRanges.push({
          startOffset: leafStartOffset + textStartIndex,
          endOffset: leafEndOffset,
        });
        this.isPageEmpty = false;
      }
    });
  }

  private handleGenericElement(element: HTMLElement) {
    if (this.pageRanges.length === 0 && this.isEmptyContent(element)) return;

    const { top, bottom, height } = element.getBoundingClientRect();
    const startOffset = Number(element.dataset.startOffset);
    const endOffset = Number(element.dataset.endOffset);

    if (isNaN(startOffset) || isNaN(endOffset)) {
      return;
    }

    const range: OffsetRange = {
      startOffset,
      endOffset,
    };

    if (this.baseTop === null) {
      this.baseTop = top;
    }

    if (bottom - this.baseTop > this.containerHeight) {
      this.flushCurrentPage();

      if (height > this.containerHeight) {
        this.pages.push({
          ...range,
          heading: this.pendingHeading,
          bgm: this.pendingBgm,
        });
      } else {
        if (!this.isEmptyContent(element)) {
          this.pageRanges = [range];
          this.isPageEmpty = false;
        }
        this.baseTop = top;
      }
    } else {
      this.pageRanges.push(range);
      if (!this.isEmptyContent(element)) {
        this.isPageEmpty = false;
      }
    }
  }

  private flushCurrentPage() {
    if (this.isPageEmpty) return;

    this.pages.push({
      startOffset: this.pageRanges[0].startOffset,
      endOffset: this.pageRanges.at(-1)!.endOffset,
      heading: this.pendingHeading,
      bgm: this.pendingBgm,
    });

    this.pageRanges = [];
    this.isPageEmpty = true;
    this.baseTop = null;
  }

  private flushRemaining() {
    if (!this.isPageEmpty) {
      this.flushCurrentPage();
    }
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
