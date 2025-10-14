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
      createdAt: post.created_at,
      content: post.content,
      tags: post.tags,
    };
  });
}

export async function fetchPost(postId: string): Promise<PostDto> {
  const response = await api.get(`/api/posts/${postId}`);
  const post = response.data as Post;

  return {
    id: post.id,
    title: post.title,
    createdAt: post.created_at,
    content: post.content,
    tags: post.tags,
  };
}
