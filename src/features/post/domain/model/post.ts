import { extractHeadings } from '@/features/post/domain/lib/parse';
import Heading from '@/features/post/domain/model/heading';

export default class Post {
  public readonly headings: Heading[];

  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly createdAt: string,
    public readonly updatedAt: string,
    public readonly content: string,
    public readonly tags: string[],
    public readonly userId: string,
    public readonly authorName: string,
    public readonly isDeleted: boolean,
    public readonly seriesId: string | null,
    public readonly seriesOrder: number | null,
    public readonly seriesTitle: string | null
  ) {
    this.headings = extractHeadings(content);
  }
}
