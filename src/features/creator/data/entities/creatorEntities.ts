export type CreatorStatus = 'pending' | 'sent' | 'accepted' | 'rejected';

export interface CreatorEntity {
  id: string;
  channel_name: string;
  email: string;
  memo: string | null;
  status: CreatorStatus;
  created_at: string;
}
