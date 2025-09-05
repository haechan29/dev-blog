import { PostStatResponseDto } from '@/features/postStat/data/dto/postStatResponseDto';
import { api } from '@/lib/api';

export async function fetchPostStat(
  postId: string
): Promise<PostStatResponseDto> {
  const response = await api.get(`/api/posts/stats/${postId}`);
  const postStat = response.data;

  return {
    id: postStat.id,
    postId: postStat.post_id,
    likeCount: postStat.like_count,
    commentCount: postStat.comment_count,
    createdAt: postStat.created_at,
    updatedAt: postStat.updated_at,
  };
}

export async function createPostStat(postId: string): Promise<void> {
  await api.post(`/api/posts/stats/${postId}`);
}

export async function deletePostStat(postId: string): Promise<void> {
  await api.delete(`/api/posts/stats/${postId}`);
}
