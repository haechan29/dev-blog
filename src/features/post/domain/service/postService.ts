import * as PostRespository from '@/features/post/data/repository/postRepository';
import toDomain from '@/features/post/domain/mapper/postMapper';
import Post from '@/features/post/domain/model/post';

export async function fetchAllPosts() {
  const dtos = await PostRespository.fetchAllPosts();
  return dtos
    .map(dto => toDomain(dto))
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function fetchPostBySlug(slug: string): Promise<Post> {
  const dto = await PostRespository.fetchPostBySlug(slug);
  return toDomain(dto);
}
