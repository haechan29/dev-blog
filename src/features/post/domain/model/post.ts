import { PostVisibility } from '@/features/post/domain/types/postVisibility';

export default class Post {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly createdAt: string,
    public readonly updatedAt: string,
    public readonly contentJson: object,
    public readonly preview: string,
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
    public readonly commentCount: number,
    public readonly visibility: PostVisibility
  ) {}
}
