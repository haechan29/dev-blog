import * as PostRespository from '@/features/post/data/repository/postRepository';
import toDomain from '@/features/post/domain/mapper/postMapper';
import Post from '@/features/post/domain/model/post';

export async function fetchPosts() {
  const dtos = await PostRespository.fetchPosts();
  return dtos.map(toDomain);
}

export async function fetchPost(postId: string): Promise<Post> {
  const dto = await PostRespository.fetchPost(postId);
  return toDomain(dto);
}
