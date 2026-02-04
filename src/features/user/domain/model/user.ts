export interface User {
  id: string;
  nickname: string | null;
  bio: string | null;
  profileImageUrl: string | null;
  createdAt: string;
  updatedAt: string | null;
  deletedAt: string | null;
}
