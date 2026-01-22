export interface OutreachEmail {
  id: string;
  creatorId: string;
  direction: 'sent' | 'received';
  subject: string;
  body: string;
  sentAt: string;
  isRead: boolean;
}
