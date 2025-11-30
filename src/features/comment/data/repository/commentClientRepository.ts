import { CommentResponseDto } from '@/features/comment/data/dto/commentResponseDto';
import { api } from '@/lib/api';

export async function getComments(
  postId: string
): Promise<CommentResponseDto[]> {
  const response = await api.get(`/api/posts/${postId}/comments`);
  return response.data;
}

export async function createComment({
  postId,
  ...requestBody
}: {
  postId: string;
  content: string;
  password: string;
}): Promise<CommentResponseDto> {
  const response = await api.post(`/api/posts/${postId}/comments`, requestBody);
  return response.data;
}

export async function updateComment({
  postId,
  commentId,
  ...requestBody
}: {
  postId: string;
  commentId: number;
  content: string;
  password: string;
}): Promise<CommentResponseDto> {
  const response = await api.patch(
    `/api/posts/${postId}/comments/${commentId}`,
    requestBody
  );
  return response.data;
}

export async function deleteComment(
  postId: string,
  commentId: number,
  password: string
): Promise<void> {
  await api.delete(`/api/posts/${postId}/comments/${commentId}`, {
    headers: {
      'X-Comment-Password': password,
    },
  });
}

export async function incrementLikeCount(
  postId: string,
  commentId: number
): Promise<CommentResponseDto> {
  const response = await api.post(
    `/api/posts/${postId}/comments/${commentId}/likeCount/increment`
  );
  return response.data;
}

export async function decrementLikeCount(
  postId: string,
  commentId: number
): Promise<CommentResponseDto> {
  const response = await api.post(
    `/api/posts/${postId}/comments/${commentId}/likeCount/decrement`
  );
  return response.data;
}
