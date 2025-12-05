import * as PostServerRepository from '@/features/post/data/repository/postServerRepository';
import { toDomain } from '@/features/post/domain/mapper/postMapper';
import Post from '@/features/post/domain/model/post';
import 'server-only';

export async function fetchAllPosts(userId?: string) {
  const dtos = await PostServerRepository.fetchAllPosts(userId);
  return dtos.map(toDomain);
}

export async function fetchPost(postId: string): Promise<Post> {
  const dto = await PostServerRepository.fetchPost(postId);
  return toDomain(dto);
}
