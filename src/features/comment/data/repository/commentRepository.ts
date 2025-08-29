import axios from 'axios';
import { CommentResponseDto } from '@/features/comment/data/dto/commentResponseDto';
import { Comment } from '@/types/env'

export async function getComments(postId: string): Promise<CommentResponseDto[]> {
  const response = await axios.get(`/api/comments?post_id=${postId}`);
  const data = response.data.data;
  return data.map((comment: Comment) => ({
    id: comment.id,
    postId: comment.post_id,
    authorName: comment.author_name,
    content: comment.content,
    createdAt: comment.created_at,
    updatedAt: comment.updated_at
  }));
}

export async function createComment(requestBody: {
  postId: string, 
  authorName: string, 
  content: string, 
  password: string
}): Promise<CommentResponseDto> {
  const response = await axios.post('/api/comments', requestBody);
  const comment = response.data.data;
  return {
    id: comment.id,
    postId: comment.post_id,
    authorName: comment.author_name,
    content: comment.content,
    createdAt: comment.created_at,
    updatedAt: comment.updated_at
  };
}

export async function updateComment(requestBody: {
  commentId: number, 
  content: string, 
  password: string
}): Promise<CommentResponseDto> {
  const response = await axios.put('/api/comments', requestBody);
  const comment = response.data.data;
  return {
    id: comment.id,
    postId: comment.post_id,
    authorName: comment.author_name,
    content: comment.content,
    createdAt: comment.created_at,
    updatedAt: comment.updated_at
  };
}

export async function deleteComment(commentId: number, password: string): Promise<void> {
  await axios.delete(`/api/comments?comment_id=${commentId}`, {
    headers: {
      'X-Comment-Password': password
    }
  });
}