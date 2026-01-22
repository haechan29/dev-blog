export interface OutreachEmail {
  id: string;
  direction: 'sent' | 'received';
  subject: string;
  body: string;
  sentAt: string;
}
