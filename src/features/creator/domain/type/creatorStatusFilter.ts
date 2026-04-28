import { CREATOR_STATUS } from '@/features/creator/domain/type/creatorStatus';

export const CREATOR_STATUS_FILTER = [...CREATOR_STATUS, 'all'] as const;

export type CreatorStatusFilter = (typeof CREATOR_STATUS_FILTER)[number];
