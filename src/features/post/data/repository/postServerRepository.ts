import * as FeedUsecase from '@/features/post/data/usecases/feedUsecase';
import * as PostUsecase from '@/features/post/data/usecases/postUsecase';
import * as SearchUsecase from '@/features/post/data/usecases/searchUsecase';
import 'server-only';

export async function getFeedPosts(params: {
  cursor: string | null;
  userId?: string;
  excludeId?: string;
  tag?: string;
}) {
  return await FeedUsecase.getFeedPosts(params);
}

export async function getPostsByUserId(userId: string) {
  return await PostUsecase.getPostsByUserId(userId);
}

export async function getPost(postId: string) {
  return await PostUsecase.getPost(postId);
}

export async function searchPosts(params: {
  query: string;
  cursorScore?: number;
  cursorId?: string;
}) {
  return await SearchUsecase.searchPosts(params);
}
