import * as PostServerRepository from '@/features/post/data/repository/postServerRepository';
import { toDomain } from '@/features/post/domain/mapper/postMapper';
import Post from '@/features/post/domain/model/post';
import 'server-only';

export async function getFeedPosts(params: {
  cursor: string | null;
  userId?: string;
  excludeId?: string;
  tag?: string;
}) {
  const result = await PostServerRepository.getFeedPosts(params);
  return {
    posts: result.posts.map(toDomain),
    nextCursor: result.nextCursor,
  };
}

export async function getPostsByUserId(userId: string) {
  const dtos = await PostServerRepository.getPostsByUserId(userId);
  return dtos.map(toDomain);
}

export async function getPost(postId: string): Promise<Post> {
  const dto = await PostServerRepository.getPost(postId);
  return toDomain(dto);
}

export async function searchPosts(params: {
  query: string;
  cursorScore?: number;
  cursorId?: string;
}) {
  const result = await PostServerRepository.searchPosts(params);
  return {
    posts: result.posts.map(toDomain),
    nextCursor: result.nextCursor,
  };
}
