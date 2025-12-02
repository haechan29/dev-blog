export interface PostResponseDto {
  id: string;
  title: string;
  tags: string[];
  content: string;
  createdAt: string;
  updatedAt: string;
  userId: string | null;
  guestId: string | null;
  authorName: string;
  isDeleted: boolean;
  isGuest: boolean;
  seriesId: string | null;
  seriesOrder: number | null;
}
