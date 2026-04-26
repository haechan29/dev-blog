import { CreatorDto } from '@/features/creator/data/dto/creatorDto';
import { CREATOR_STATUS_CONFIG } from '@/features/creator/ui/constants/creatorStatusConfig';
import { CreatorProps } from '@/features/creator/ui/props/creatorProps';

export function toProps(creator: CreatorDto): CreatorProps {
  return {
    id: creator.id,
    channelName: creator.channelName,
    email: creator.email,
    memo: creator.memo,
    status: creator.status,
    createdAt: creator.createdAt,
    userId: creator.userId,
    label: CREATOR_STATUS_CONFIG[creator.status].label,
    color: CREATOR_STATUS_CONFIG[creator.status].color,
  };
}
