import { extractHeadings } from '@/features/post/domain/lib/parse';
import Heading from '@/features/post/domain/model/heading';
import { PostVisibility } from '@/features/post/domain/types/postVisibility';

export default class Post {
  public readonly headings: Heading[];

  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly createdAt: string,
    public readonly updatedAt: string,
    public readonly content: string,
    public readonly contentJson: object | null,
    public readonly tags: string[],
    public readonly userId: string,
    public readonly authorName: string | null,
    public readonly bio: string | null,
    public readonly profileImageUrl: string | null,
    public readonly seriesId: string | null,
    public readonly seriesOrder: number | null,
    public readonly seriesTitle: string | null,
    public readonly likeCount: number,
    public readonly viewCount: number,
    public readonly visibility: PostVisibility
  ) {
    this.headings = extractHeadings(content);
  }
}
