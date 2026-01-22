export type EmailDirection = 'sent' | 'received';

export interface OutreachEmailEntity {
  id: string;
  creator_id: string;
  gmail_thread_id: string | null;
  gmail_message_id: string | null;
  message_id: string | null;
  direction: EmailDirection;
  subject: string;
  body: string;
  sent_at: string;
}
