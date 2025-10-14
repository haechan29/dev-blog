import { PostDto } from '@/features/post/data/dto/postDto';
import { api } from '@/lib/api';

export async function fetchPost(postId: string): Promise<PostDto> {
  const response = await api.get(`/api/posts/${postId}`);
  const post = response.data;

  return {
    id: post.id,
    postId: post.post_id,
    title: post.title,
    createdAt: post.created_at,
    content: post.content,
    tags: post.tags,
  };
}

export async function fetchAllPosts(): Promise<PostDto[]> {
  const response = await api.get(`/api/posts/generator`);
  const post = response.data;

  return [
    {
      id: post.id,
      postId: post.post_id,
      title: post.title,
      createdAt: post.created_at,
      content: post.content,
      tags: post.tags,
    },
  ];
}
