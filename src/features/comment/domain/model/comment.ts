export class Comment {
  constructor(
    public readonly id: number,
    public readonly postId: string,
    public readonly authorName: string,
    public readonly content: string,
    public readonly createdAt: string,
    public readonly updatedAt: string
  ) {}
}