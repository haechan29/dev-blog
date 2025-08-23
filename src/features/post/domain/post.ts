import { PostItemProps } from '@/features/post/ui/postItemProps'
import { extractHeadings, extractPlainText } from '@/lib/posts';

export type Heading = {
  id: string;
  text: string;
  level: number;
}

export class Post {
  constructor (
    public readonly slug: string,
    public readonly title: string,
    public readonly date: string,
    public readonly content: string,
    public readonly tags?: string[]
  ) {}

  toProps(): PostItemProps {
    return {
      slug: this.slug,
      title: this.title,
      date: this.date,
      tags: this.tags ?? [],
      content: this.content,
      headings: extractHeadings(this.content),
      plainText: extractPlainText(this.content)
    };
  }
}