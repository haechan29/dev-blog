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
    public readonly userId: string | null,
    public readonly guestId: string | null,
    public readonly authorName: string,
    public readonly isDeleted: boolean,
    public readonly isGuest: boolean
  ) {
    this.headings = extractHeadings(content);
  }
}
