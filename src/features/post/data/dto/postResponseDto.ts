export interface PostResponseDto {
  id: string;
  authorName: string;
  title: string;
  tags: string[];
  content: string;
  createdAt: string;
  updatedAt: string;
  authorId?: string;
}
