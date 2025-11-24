import { PostResponseDto } from '@/features/post/data/dto/postResponseDto';
import { toData } from '@/features/post/data/mapper/postMapper';
import { getPostsFromDB } from '@/features/post/data/queries/postQueries';
import { api } from '@/lib/api';
import { Post } from '@/types/env';
import { isServer } from '@tanstack/react-query';

export async function fetchPosts(): Promise<PostResponseDto[]> {
  let posts: Post[];

  if (isServer) {
    posts = await getPostsFromDB();
  } else {
    const response = await api.get(`/api/posts`);
    posts = response.data;
  }

  return posts.map(toData);
}

export async function fetchPost(postId: string): Promise<PostResponseDto> {
  const response = await api.get(`/api/posts/${postId}`);
  const post = response.data as Post;
  return toData(post);
}

export async function createPost(requestDto: {
  title: string;
  content: string;
  tags: string[];
  password: string;
}): Promise<PostResponseDto> {
  const response = await api.post(`/api/posts`, requestDto);
  const post: Post = response.data;
  return toData(post);
}

export async function updatePost({
  postId,
  ...requestBody
}: {
  postId: string;
  title?: string;
  content?: string;
  tags?: string[];
  password?: string;
}): Promise<PostResponseDto> {
  const response = await api.patch(`/api/posts/${postId}`, requestBody);
  const post: Post = response.data;
  return toData(post);
}

export async function deletePost(
  postId: string,
  password: string
): Promise<void> {
  await api.delete(`/api/posts/${postId}`, {
    headers: {
      'X-Post-Password': password,
    },
  });
}
