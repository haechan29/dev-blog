import * as PostClientRepository from '@/features/post/data/repository/postClientRepository';
import { toDomain } from '@/features/post/domain/mapper/postMapper';
import Post from '@/features/post/domain/model/post';

export async function createPost(params: {
  title: string;
  content: string;
  tags: string[];
  password: string;
}): Promise<Post> {
  const dto = await PostClientRepository.createPost(params);
  return toDomain(dto);
}

export async function updatePost(params: {
  postId: string;
  title?: string;
  content?: string;
  tags?: string[];
  password?: string;
}): Promise<Post> {
  const post = await PostClientRepository.updatePost(params);
  return toDomain(post);
}

export async function deletePost(
  postId: string,
  password: string
): Promise<void> {
  await PostClientRepository.deletePost(postId, password);
}
