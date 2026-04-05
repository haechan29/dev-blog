import { CommentItemProps } from '@/features/comment/ui/commentItemProps';

export interface CommentCursor {
  score: number;
  id: string;
}

export interface CommentsPage {
  comments: CommentItemProps[];
  nextCursor: CommentCursor | null;
}
