import * as PostRespository from '@/features/post/data/repository/postRepository';
import { toDomain } from '@/features/post/domain/mapper/postMapper';
import Post from '@/features/post/domain/model/post';

export async function fetchPosts() {
  const dtos = await PostRespository.fetchPosts();
  return dtos.map(toDomain);
}

export async function fetchPost(postId: string): Promise<Post> {
  const dto = await PostRespository.fetchPost(postId);
  return toDomain(dto);
}

export async function createPost(params: {
  title: string;
  content: string;
  tags: string[];
  password: string;
}): Promise<Post> {
  const dto = await PostRespository.createPost(params);
  return toDomain(dto);
}

export async function deletePost(
  postId: string,
  commentId: number,
  password: string
): Promise<void> {
  await PostRespository.deletePost(postId, password);
}
