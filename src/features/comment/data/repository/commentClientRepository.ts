import { CommentResponseDto } from '@/features/comment/data/dto/commentResponseDto';
import { toData } from '@/features/comment/data/mapper/commentMapper';
import { Comment } from '@/features/comment/domain/types/comment';
import { api } from '@/lib/api';

export async function getComments(
  postId: string
): Promise<CommentResponseDto[]> {
  const response = await api.get(`/api/posts/${postId}/comments`);
  const data = response.data;

  return data.map((comment: Comment) => ({
    id: comment.id,
    postId: comment.post_id,
    authorName: comment.author_name,
    content: comment.content,
    createdAt: comment.created_at,
    updatedAt: comment.updated_at,
    likeCount: comment.like_count,
  }));
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
  const comment: Comment = response.data;
  return toData(comment);
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
  const comment: Comment = response.data;
  return toData(comment);
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
  const comment = response.data;
  return toData(comment);
}

export async function decrementLikeCount(
  postId: string,
  commentId: number
): Promise<CommentResponseDto> {
  const response = await api.post(
    `/api/posts/${postId}/comments/${commentId}/likeCount/decrement`
  );
  const comment = response.data;
  return toData(comment);
}
