export interface UserResponseDto {
  id: string;
  nickname: string;
  createdAt: string;
  updatedAt: string | null;
  deletedAt: string | null;
  authUserId: string | null;
  registeredAt: string | null;
}
