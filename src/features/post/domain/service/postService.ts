import * as PostRespository from '@/features/post/data/repository/postRepository';
import toDomain from '@/features/post/data/mapper/postMapper';
import { Post } from '../model/post';

export async function fetchAllPosts() {
  const dtos = await PostRespository.fetchAllPosts();
  return dtos.map(dto => toDomain(dto));
}

export async function fetchPostBySlug(slug: string): Promise<Post> {
  const dto = await PostRespository.fetchPostBySlug(slug);
  return toDomain(dto);
}