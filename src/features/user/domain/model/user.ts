export type UserStatus = 'GUEST' | 'ACTIVE' | 'DELETED';

export interface User {
  id: string;
  nickname: string | null;
  bio: string | null;
  profileImageUrl: string | null;
  createdAt: string;
  updatedAt: string | null;
  deletedAt: string | null;
  userStatus: UserStatus;
}
