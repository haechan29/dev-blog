import * as PostServerRepository from '@/features/post/data/repository/postServerRepository';
import { toDomain } from '@/features/post/domain/mapper/postMapper';
import Post from '@/features/post/domain/model/post';
import 'server-only';

export async function fetchPosts() {
  const dtos = await PostServerRepository.fetchPosts();
  return dtos.map(toDomain);
}

export async function getFeedPosts(cursor: string | null, userId?: string) {
  const result = await PostServerRepository.getFeedPosts(cursor, userId);
  return {
    posts: result.posts.map(toDomain),
    nextCursor: result.nextCursor,
  };
}

export async function fetchPostsByUserId(userId: string) {
  const dtos = await PostServerRepository.fetchPostsByUserId(userId);
  return dtos.map(toDomain);
}

export async function fetchPost(postId: string): Promise<Post> {
  const dto = await PostServerRepository.fetchPost(postId);
  return toDomain(dto);
}
