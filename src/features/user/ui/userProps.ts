import { User } from '@/features/user/domain/model/user';

export interface UserProps {
  id: string;
  nickname: string;
  bio: string | null;
  profileImageUrl: string | null;
  createdAt: string;
  updatedAt: string | null;
  deletedAt: string | null;
}

export function createProps(user: User): UserProps {
  return {
    id: user.id,
    nickname: toUserNickname(user),
    bio: user.bio,
    profileImageUrl: user.profileImageUrl,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    deletedAt: user.deletedAt,
  };
}

export function toUserNickname({
  id,
  nickname,
}: Pick<User, 'id' | 'nickname'>) {
  return nickname ?? `Guest#${id.slice(0, 4)}`;
}
