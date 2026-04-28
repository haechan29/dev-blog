import { PostForbiddenError } from '@/features/post/data/errors/postErrors';
import { toDto } from '@/features/post/data/mapper/postMapper';
import * as PostQueries from '@/features/post/data/queries/postQueries';
import { getUserId } from '@/lib/user';

export async function getPost(postId: string) {
  const userId = await getUserId();
  const post = await PostQueries.fetchPost(postId);

  if (post.visibility === 'private' && post.userId !== userId) {
    throw new PostForbiddenError('비공개 게시글입니다');
  }

  return toDto(post);
}

export async function getPostsByUserId(userId: string) {
  const currentUserId = await getUserId();

  const posts = await PostQueries.fetchPostsByUserId(userId, currentUserId);

  return posts.map(toDto);
}
