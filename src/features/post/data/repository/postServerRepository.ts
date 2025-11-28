import * as PostQueries from '@/features/post/data/queries/postQueries';
import 'server-only';

export async function fetchPosts() {
  return await PostQueries.fetchPosts();
}

export async function fetchPost(postId: string) {
  return await PostQueries.fetchPost(postId);
}
