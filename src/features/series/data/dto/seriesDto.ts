export interface SeriesDto {
  id: string;
  title: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  userId: string;
  authorName: string;
  postCount: number;
}
