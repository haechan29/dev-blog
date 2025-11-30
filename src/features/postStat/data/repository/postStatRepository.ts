import { PostStatResponseDto } from '@/features/postStat/data/dto/postStatResponseDto';
import { toData } from '@/features/postStat/data/mapper/postStatMapper';
import { PostStat } from '@/features/postStat/domain/types/postStat';
import { api } from '@/lib/api';

export async function fetchPostStat(
  postId: string
): Promise<PostStatResponseDto> {
  const response = await api.get(`/api/posts/${postId}/stats`);
  const postStat: PostStat = response.data;
  return toData(postStat);
}

export async function incrementLikeCount(
  postId: string
): Promise<PostStatResponseDto> {
  const response = await api.post(
    `/api/posts/${postId}/stats/likeCount/increment`
  );
  const postStat = response.data;
  return toData(postStat);
}

export async function incrementViewCount(
  postId: string
): Promise<PostStatResponseDto> {
  const response = await api.post(
    `/api/posts/${postId}/stats/viewCount/increment`
  );
  const postStat = response.data;
  return toData(postStat);
}
