import * as PostClientRepository from '@/features/post/data/repository/postClientRepository';
import { toDomain } from '@/features/post/domain/mapper/postMapper';

export async function createPost(params: {
  title: string;
  content: string;
  tags: string[];
  password: string;
}) {
  const dto = await PostClientRepository.createPost(params);
  return toDomain(dto);
}

export async function updatePost(params: {
  postId: string;
  title?: string;
  content?: string;
  tags?: string[];
  password?: string;
  seriesId?: string | null;
  seriesOrder?: number | null;
}) {
  const post = await PostClientRepository.updatePost(params);
  return toDomain(post);
}

export async function updatePostsOrder(postIds: string[]) {
  await PostClientRepository.updatePostsOrder(postIds);
}

export async function deletePost(postId: string, password: string) {
  await PostClientRepository.deletePost(postId, password);
}
