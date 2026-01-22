export type CreatorStatus = 'pending' | 'sent' | 'accepted' | 'rejected';

export const CREATOR_STATUS_LABELS: Record<CreatorStatus, string> = {
  pending: '대기',
  sent: '발송됨',
  accepted: '수락',
  rejected: '거절',
};

export interface Creator {
  id: string;
  channelName: string;
  email: string;
  memo: string | null;
  status: 'pending' | 'sent' | 'accepted' | 'rejected';
  createdAt: string;
}
