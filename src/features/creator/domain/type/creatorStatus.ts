export const CREATOR_STATUS = [
  'pending',
  'sent',
  'accepted',
  'rejected',
] as const;

export type CreatorStatus = (typeof CREATOR_STATUS)[number];

export function isCreatorStatus(status: string): status is CreatorStatus {
  return CREATOR_STATUS.includes(status as CreatorStatus);
}

export function toCreatorStatus(status: string): CreatorStatus {
  if (!isCreatorStatus(status)) {
    throw new Error(`형식이 올바르지 않습니다: ${status}`);
  }
  return status;
}
