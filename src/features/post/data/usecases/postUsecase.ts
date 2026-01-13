import { PostForbiddenError } from '@/features/post/data/errors/postErrors';
import { toDto } from '@/features/post/data/mapper/postMapper';
import * as PostQueries from '@/features/post/data/queries/postQueries';
import { getUserId } from '@/lib/user';

export async function getPost(postId: string) {
  const userId = await getUserId();
  const post = await PostQueries.fetchPost(postId);

  if (post.is_private && post.user_id !== userId) {
    throw new PostForbiddenError('비공개 게시글입니다');
  }

  return toDto(post);
}
