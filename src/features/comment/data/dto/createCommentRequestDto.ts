export interface CreateCommentRequestDto {
  postId: string;
  authorName: string;
  content: string;
  password: string;
}