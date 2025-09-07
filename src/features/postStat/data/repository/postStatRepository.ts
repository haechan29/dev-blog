import { PostStatResponseDto } from '@/features/postStat/data/dto/postStatResponseDto';
import { api } from '@/lib/api';

export async function fetchPostStat(
  postId: string
): Promise<PostStatResponseDto> {
  const response = await api.get(`/api/posts/${postId}/stats`);
  const postStat = response.data;

  return {
    id: postStat.id,
    postId: postStat.post_id,
    likeCount: postStat.like_count,
    viewCount: postStat.view_count,
    createdAt: postStat.created_at,
    updatedAt: postStat.updated_at,
  };
}

export async function createPostStat(postId: string): Promise<void> {
  await api.post(`/api/posts/${postId}/stats`);
}

export async function deletePostStat(postId: string): Promise<void> {
  await api.delete(`/api/posts/${postId}/stats`);
}

export async function incrementLikeCount(
  postId: string
): Promise<PostStatResponseDto> {
  const response = await api.post(
    `/api/posts/${postId}/stats/likeCount/increment`
  );
  const postStat = response.data;

  return {
    id: postStat.id,
    postId: postStat.post_id,
    likeCount: postStat.like_count,
    viewCount: postStat.view_count,
    createdAt: postStat.created_at,
    updatedAt: postStat.updated_at,
  };
}

export async function incrementViewCount(
  postId: string
): Promise<PostStatResponseDto> {
  const response = await api.post(
    `/api/posts/${postId}/stats/viewCount/increment`
  );
  const postStat = response.data;

  return {
    id: postStat.id,
    postId: postStat.post_id,
    likeCount: postStat.like_count,
    viewCount: postStat.view_count,
    createdAt: postStat.created_at,
    updatedAt: postStat.updated_at,
  };
}
