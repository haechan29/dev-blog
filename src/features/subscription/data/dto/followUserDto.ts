import { UserResponseDto } from '@/features/user/data/dto/userResponseDto';

export type FollowUserDto = Pick<UserResponseDto, 'id' | 'nickname'>;
