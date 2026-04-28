import { CreatorStatus } from '@/features/creator/domain/type/creatorStatus';
import { CreatorStatusFilter } from '@/features/creator/domain/type/creatorStatusFilter';

export const CREATOR_STATUS_CONFIG: Record<
  CreatorStatus,
  {
    label: string;
    color: string;
  }
> = {
  pending: { label: '대기', color: 'bg-gray-200 text-gray-700' },
  sent: { label: '발송됨', color: 'bg-blue-100 text-blue-700' },
  accepted: { label: '수락', color: 'bg-green-100 text-green-700' },
  rejected: { label: '거절', color: 'bg-red-100 text-red-700' },
};

export const CREATOR_STATUS_FILTER_CONFIG: Record<
  CreatorStatusFilter,
  {
    label: string;
  }
> = {
  ...CREATOR_STATUS_CONFIG,
  all: { label: '전체' },
};
