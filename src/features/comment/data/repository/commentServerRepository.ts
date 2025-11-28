import * as CommentQueries from '@/features/comment/data/queries/commentQueries';
import 'server-only';

export async function getComments(postId: string) {
  return await CommentQueries.fetchComments(postId);
}
