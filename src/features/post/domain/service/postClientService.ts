import * as PostClientRepository from '@/features/post/data/repository/postClientRepository';
import { toDomain } from '@/features/post/domain/mapper/postMapper';
import Post from '@/features/post/domain/model/post';
import { PostVisibility } from '@/features/post/domain/types/postVisibility';

export async function getPost(postId: string): Promise<Post> {
  const dto = await PostClientRepository.getPost(postId);
  return toDomain(dto);
}

export async function getFeedPosts(params: {
  cursor: string | null;
  excludeId?: string;
  tag?: string;
}) {
  const result = await PostClientRepository.getFeedPosts(params);
  return {
    posts: result.posts.map(toDomain),
    nextCursor: result.nextCursor,
  };
}

export async function getPostsByUserId(userId: string) {
  const dtos = await PostClientRepository.getPostsByUserId(userId);
  return dtos.map(toDomain);
}

export async function searchPosts(params: {
  query: string;
  cursorScore?: number;
  cursorId?: string;
}) {
  const result = await PostClientRepository.searchPosts(params);
  return {
    posts: result.posts.map(toDomain),
    nextCursor: result.nextCursor,
  };
}

export async function createPost(params: {
  title: string;
  contentJson: object;
  tags: string[];
  password: string;
  visibility: PostVisibility;
  draftId?: string;
}) {
  const dto = await PostClientRepository.createPost(params);
  return toDomain(dto);
}

export async function updatePost(params: {
  postId: string;
  title?: string;
  contentJson?: object;
  tags?: string[];
  password?: string;
  seriesId?: string | null;
  seriesOrder?: number | null;
  visibility?: PostVisibility;
  draftId?: string;
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
