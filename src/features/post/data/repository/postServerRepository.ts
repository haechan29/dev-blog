import * as PostQueries from '@/features/post/data/queries/postQueries';
import * as FeedUsecase from '@/features/post/data/usecases/feedUsecase';
import 'server-only';

export async function getFeedPosts(cursor: string | null, userId?: string) {
  return await FeedUsecase.getFeedPosts(cursor, userId);
}

export async function getPostsByUserId(userId: string) {
  return await PostQueries.fetchPostsByUserId(userId);
}

export async function getPost(postId: string) {
  return await PostQueries.fetchPost(postId);
}
