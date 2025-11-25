import { CommentResponseDto } from '@/features/comment/data/dto/commentResponseDto';
import { toData } from '@/features/comment/data/mapper/commentMapper';
import { getCommentsFromDB } from '@/features/comment/data/queries/commentQueries';
import { Comment } from '@/types/env';
import 'server-only';

export async function getComments(
  postId: string
): Promise<CommentResponseDto[]> {
  const comments: Comment[] = await getCommentsFromDB(postId);
  return comments.map(toData);
}
