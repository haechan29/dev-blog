export interface PostDto {
  id: string;
  title: string;
  tags: string[];
  content: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  authorName: string;
  isDeleted: boolean;
  seriesId: string | null;
  seriesOrder: number | null;
  seriesTitle: string | null;
}
