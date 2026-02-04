export interface UserResponseDto {
  id: string;
  nickname: string | null;
  createdAt: string;
  updatedAt: string | null;
  deletedAt: string | null;
  registeredAt: string | null;
  profileImageUrl: string | null;
  bio: string | null;
}
