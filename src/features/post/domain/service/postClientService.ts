import * as PostClientRepository from '@/features/post/data/repository/postClientRepository';
import { toDomain } from '@/features/post/domain/mapper/postMapper';
import Post from '@/features/post/domain/model/post';

export async function getPost(postId: string): Promise<Post> {
  const dto = await PostClientRepository.getPost(postId);
  return toDomain(dto);
}

export async function getFeedPosts(cursor: string | null, excludeId?: string) {
  const result = await PostClientRepository.getFeedPosts(cursor, excludeId);
  return {
    posts: result.posts.map(toDomain),
    nextCursor: result.nextCursor,
  };
}

export async function getPostsByUserId(userId: string) {
  const dtos = await PostClientRepository.getPostsByUserId(userId);
  return dtos.map(toDomain);
}

export async function searchPosts(
  query: string,
  limit: number,
  cursorScore?: number,
  cursorId?: string
) {
  const result = await PostClientRepository.searchPosts(
    query,
    limit,
    cursorScore,
    cursorId
  );
  return {
    posts: result.posts.map(toDomain),
    nextCursor: result.nextCursor,
  };
}

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

export async function updatePostsInSeries(
  posts: Pick<Post, 'id' | 'seriesId' | 'seriesOrder'>[]
) {
  await PostClientRepository.updatePostsInSeries(posts);
}

export async function deletePost(postId: string, password: string) {
  await PostClientRepository.deletePost(postId, password);
}
