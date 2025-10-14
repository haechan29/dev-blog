import * as PostRespository from '@/features/post/data/repository/postRepository';
import toDomain from '@/features/post/domain/mapper/postMapper';
import Post from '@/features/post/domain/model/post';

export async function fetchAllPosts() {
  const dtos = await PostRespository.fetchAllPosts();
  return dtos
    .map(dto => toDomain(dto))
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export async function fetchPost(postId: string): Promise<Post> {
  const dto = await PostRespository.fetchPost(postId);
  return toDomain(dto);
}
