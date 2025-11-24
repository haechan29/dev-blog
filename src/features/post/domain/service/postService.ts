import * as PostRepository from '@/features/post/data/repository/postRepository';
import { toDomain } from '@/features/post/domain/mapper/postMapper';
import Post from '@/features/post/domain/model/post';

export async function fetchPosts() {
  const dtos = await PostRepository.fetchPosts();
  return dtos.map(toDomain);
}

export async function fetchPost(postId: string): Promise<Post> {
  const dto = await PostRepository.fetchPost(postId);
  return toDomain(dto);
}

export async function createPost(params: {
  title: string;
  content: string;
  tags: string[];
  password: string;
}): Promise<Post> {
  const dto = await PostRepository.createPost(params);
  return toDomain(dto);
}

export async function updatePost(params: {
  postId: string;
  title?: string;
  content?: string;
  tags?: string[];
  password?: string;
}): Promise<Post> {
  const post = await PostRepository.updatePost(params);
  return toDomain(post);
}

export async function deletePost(
  postId: string,
  password: string
): Promise<void> {
  await PostRepository.deletePost(postId, password);
}
