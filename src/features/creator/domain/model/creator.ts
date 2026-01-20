export interface Creator {
  id: string;
  channelName: string;
  email: string;
  memo: string | null;
  status: 'pending' | 'sent' | 'accepted' | 'rejected';
  createdAt: string;
}
