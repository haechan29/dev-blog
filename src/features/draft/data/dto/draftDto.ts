export interface DraftDto {
  id: string;
  userId: string;
  postId: string | null;
  title: string;
  contentJson: object | null;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

