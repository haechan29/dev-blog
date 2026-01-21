export type OutreachEmailStatus = 'sent' | 'responded';

export interface OutreachEmailEntity {
  id: string;
  creator_id: string;
  subject: string;
  body: string;
  status: OutreachEmailStatus;
  sent_at: string;
  responded_at: string | null;
  created_at: string;
  updated_at: string;
  creators?: { channel_name: string };
}
