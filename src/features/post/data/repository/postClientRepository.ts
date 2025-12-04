import { PostDto } from '@/features/post/data/dto/postDto';
import { api } from '@/lib/api';

export async function createPost(requestDto: {
  title: string;
  content: string;
  tags: string[];
  password: string;
}): Promise<PostDto> {
  const response = await api.post(`/api/posts`, requestDto);
  return response.data;
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
  seriesId?: string | null;
  seriesOrder?: number | null;
}): Promise<PostDto> {
  const response = await api.patch(`/api/posts/${postId}`, requestBody);
  return response.data;
}

export async function updatePostsOrder(postIds: string[]): Promise<void> {
  await api.patch(`/api/posts`, { postIds });
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
