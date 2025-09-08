import { CommentItemProps } from '@/features/comment/ui/commentItemProps';

export class Comment {
  constructor(
    public readonly id: number,
    public readonly postId: string,
    public readonly authorName: string,
    public readonly content: string,
    public readonly createdAt: string,
    public readonly updatedAt: string
  ) {}

  toProps(): CommentItemProps {
    return {
      id: this.id,
      postId: this.postId,
      authorName: this.authorName,
      content: this.content,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
