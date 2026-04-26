import { CreatorStatus } from '@/features/creator/domain/type/creatorStatus';

export interface CreatorDto {
  id: string;
  channelName: string;
  email: string;
  memo: string | null;
  status: CreatorStatus;
  createdAt: string;
  userId: string | null;
}
