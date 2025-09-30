import { extractHeadings } from '@/features/post/domain/lib/parse';
import Heading from '@/features/post/domain/model/heading';

export default class Post {
  public readonly headings: Heading[];

  constructor(
    public readonly slug: string,
    public readonly title: string,
    public readonly date: string,
    public readonly content: string,
    public readonly tags?: string[]
  ) {
    this.headings = extractHeadings(content);
  }
}
