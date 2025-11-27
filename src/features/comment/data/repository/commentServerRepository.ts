import { CommentResponseDto } from '@/features/comment/data/dto/commentResponseDto';
import { toData } from '@/features/comment/data/mapper/commentMapper';
import * as CommentQueries from '@/features/comment/data/queries/commentQueries';
import { Comment } from '@/features/comment/domain/types/comment';
import 'server-only';

export async function getComments(
  postId: string
): Promise<CommentResponseDto[]> {
  const comments: Comment[] = await CommentQueries.fetchComments(postId);
  return comments.map(toData);
}
