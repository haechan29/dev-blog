import { PostDto } from '@/features/post/data/dto/postDto';
import { api } from '@/lib/api';
import { Post } from '@/types/env';

export async function fetchPosts(): Promise<PostDto[]> {
  const response = await api.get(`/api/posts`);
  const posts = response.data as Post[];

  return posts.map((post: Post) => {
    return {
      id: post.id,
      title: post.title,
      tags: post.tags,
      content: post.content,
      createdAt: post.created_at,
      updatedAt: post.updated_at,
    };
  });
}

export async function fetchPost(postId: string): Promise<PostDto> {
  const response = await api.get(`/api/posts/${postId}`);
  const post = response.data as Post;

  return {
    id: post.id,
    title: post.title,
    tags: post.tags,
    content: post.content,
    createdAt: post.created_at,
    updatedAt: post.updated_at,
  };
}

export async function createPost(requestBody: {
  title: string;
  content: string;
  tags: string[];
  password: string;
}): Promise<PostDto> {
  const response = await api.post(`/api/posts`, requestBody);
  const post: Post = response.data;
  return {
    id: post.id,
    title: post.title,
    tags: post.tags,
    content: post.content,
    createdAt: post.created_at,
    updatedAt: post.updated_at,
  };
}
