export type UserStatus = 'GUEST' | 'ACTIVE' | 'DELETED';

export interface User {
  id: string;
  nickname: string;
  createdAt: string;
  updatedAt: string | null;
  deletedAt: string | null;
  userStatus: UserStatus;
}
