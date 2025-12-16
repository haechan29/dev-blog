import { api } from '@/lib/api';

export async function getIsLiked(postId: string): Promise<boolean> {
  const response = await api.get(`/api/posts/${postId}/likes`);
  return response.data;
}
