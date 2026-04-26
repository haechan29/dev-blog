import { CreatorStatus } from '@/features/creator/domain/type/creatorStatus';

export interface CreatorProps {
  id: string;
  channelName: string;
  email: string;
  memo: string | null;
  status: CreatorStatus;
  createdAt: string;
  userId: string | null;
  label: string;
  color: string | null;
}
