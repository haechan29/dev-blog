export interface OutreachEmail {
  id: string;
  creatorId: string;
  channelName?: string;
  gmailThreadId: string | null;
  gmailMessageId: string | null;
  direction: 'sent' | 'received';
  subject: string;
  body: string;
  sentAt: string;
}
