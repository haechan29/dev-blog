export interface OutreachEmail {
  id: string;
  creatorId: string;
  channelName?: string;
  subject: string;
  body: string;
  status: 'sent' | 'awaiting_response' | 'accepted' | 'rejected';
  sentAt: string;
  respondedAt: string | null;
  createdAt: string;
  updatedAt: string;
}
