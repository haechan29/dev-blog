import { CommentResponseDto } from '@/features/comment/data/dto/commentResponseDto';
import { CommentCursor } from '@/features/comment/ui/types/page';
import { api } from '@/lib/api';

export async function getRankedComments({
  postId,
  timestamp,
  cursor,
  highlightCommentId,
}: {
  postId: string;
  timestamp: string;
  cursor: CommentCursor | null;
  highlightCommentId?: string;
}): Promise<{
  comments: CommentResponseDto[];
  nextCursor: CommentCursor | null;
}> {
  const params = new URLSearchParams({ timestamp });
  if (!!cursor) {
    params.set('cursorScore', String(cursor.score));
    params.set('cursorId', cursor.id);
  } else if (highlightCommentId !== undefined) {
    params.set('highlightCommentId', highlightCommentId);
  }

  const response = await api.get(
    `/api/posts/${postId}/comments?${params.toString()}`
  );
  return response.data;
}

export async function createComment({
  postId,
  ...requestBody
}: {
  postId: string;
  content: string;
  password?: string;
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
  commentId: string;
  content: string;
  password?: string;
}): Promise<CommentResponseDto> {
  const response = await api.patch(
    `/api/posts/${postId}/comments/${commentId}`,
    requestBody
  );
  return response.data;
}

export async function deleteComment(
  postId: string,
  commentId: string,
  password?: string
): Promise<void> {
  await api.delete(`/api/posts/${postId}/comments/${commentId}`, {
    headers: {
      ...(password && { 'X-Comment-Password': password }),
    },
  });
}

export async function incrementLikeCount(
  postId: string,
  commentId: string
): Promise<CommentResponseDto> {
  const response = await api.post(
    `/api/posts/${postId}/comments/${commentId}/likeCount/increment`
  );
  return response.data;
}

export async function decrementLikeCount(
  postId: string,
  commentId: string
): Promise<CommentResponseDto> {
  const response = await api.post(
    `/api/posts/${postId}/comments/${commentId}/likeCount/decrement`
  );
  return response.data;
}
