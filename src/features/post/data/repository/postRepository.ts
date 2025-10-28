import { PostResponseDto } from '@/features/post/data/dto/postResponseDto';
import { toData } from '@/features/post/domain/mapper/postMapper';
import { api } from '@/lib/api';
import { Post } from '@/types/env';

export async function fetchPosts(): Promise<PostResponseDto[]> {
  const response = await api.get(`/api/posts`);
  const posts = response.data as Post[];

  return posts.map((post: Post) => {
    return {
      id: post.id,
      authorName: post.author_name,
      title: post.title,
      tags: post.tags,
      content: post.content,
      createdAt: post.created_at,
      updatedAt: post.updated_at,
      authorId: post.author_id,
    };
  });
}

export async function fetchPost(postId: string): Promise<PostResponseDto> {
  const response = await api.get(`/api/posts/${postId}`);
  const post = response.data as Post;

  return {
    id: post.id,
    authorName: post.author_name,
    title: post.title,
    tags: post.tags,
    content: post.content,
    createdAt: post.created_at,
    updatedAt: post.updated_at,
    authorId: post.author_id,
  };
}

export async function createPost(params: {
  title: string;
  content: string;
  tags: string[];
  password: string;
}): Promise<PostResponseDto> {
  const dto = toData(params);
  const response = await api.post(`/api/posts`, dto);
  const post: Post = response.data;
  return {
    id: post.id,
    authorName: post.author_name,
    title: post.title,
    tags: post.tags,
    content: post.content,
    createdAt: post.created_at,
    updatedAt: post.updated_at,
    authorId: post.author_id,
  };
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
