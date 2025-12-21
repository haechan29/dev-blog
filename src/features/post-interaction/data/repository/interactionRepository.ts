import { api } from '@/lib/api';

export async function getIsLiked(postId: string): Promise<boolean> {
  const response = await api.get(`/api/posts/${postId}/likes`);
  return response.data;
}

export async function addLike(postId: string): Promise<void> {
  await api.post(`/api/posts/${postId}/likes`);
}

export async function removeLike(postId: string): Promise<void> {
  await api.delete(`/api/posts/${postId}/likes`);
}

export function recordView(
  postId: string,
  readDuration: number,
  fromFeed: boolean
): boolean {
  return navigator.sendBeacon(
    `/api/posts/${postId}/views`,
    JSON.stringify({ readDuration, fromFeed })
  );
}
