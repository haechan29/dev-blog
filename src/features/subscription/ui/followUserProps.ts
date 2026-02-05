import { FollowUserDto } from '@/features/subscription/data/dto/followUserDto';
import { toUserNickname, UserProps } from '@/features/user/ui/userProps';

export type FollowUserProps = Pick<
  UserProps,
  'id' | 'nickname' | 'profileImageUrl'
>;

export function createProps(user: FollowUserDto): FollowUserProps {
  return {
    id: user.id,
    nickname: toUserNickname(user),
    profileImageUrl: user.profileImageUrl,
  };
}
