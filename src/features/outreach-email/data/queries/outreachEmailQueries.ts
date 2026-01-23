import { OutreachEmailEntity } from '@/features/outreach-email/data/entities/outreachEmailEntities';
import { supabase } from '@/lib/supabase';
import 'server-only';

const SELECT_FIELDS =
  'id, creator_id, gmail_thread_id, gmail_message_id, message_id, direction, subject, body, sent_at, is_read';

export async function fetchOutreachEmails(creatorId?: string) {
  let query = supabase
    .from('outreach_emails')
    .select(SELECT_FIELDS)
    .order('sent_at', { ascending: false });

  if (creatorId) {
    query = query.eq('creator_id', creatorId);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return data as unknown as OutreachEmailEntity[];
}

export async function fetchOutreachEmail(id: string) {
  const { data, error } = await supabase
    .from('outreach_emails')
    .select(SELECT_FIELDS)
    .eq('id', id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as unknown as OutreachEmailEntity;
}

export async function createOutreachEmail({
  creatorId,
  gmailThreadId,
  gmailMessageId,
  messageId,
  direction,
  subject,
  body,
  sentAt,
}: {
  creatorId: string;
  gmailThreadId: string | null;
  gmailMessageId: string | null;
  messageId: string | null;
  direction: 'sent' | 'received';
  subject: string;
  body: string;
  sentAt: string;
}) {
  const { data, error } = await supabase
    .from('outreach_emails')
    .insert({
      creator_id: creatorId,
      gmail_thread_id: gmailThreadId,
      gmail_message_id: gmailMessageId,
      message_id: messageId,
      direction,
      subject,
      body,
      sent_at: sentAt,
    })
    .select(SELECT_FIELDS)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as unknown as OutreachEmailEntity;
}

export async function deleteOutreachEmail(id: string) {
  const { error } = await supabase
    .from('outreach_emails')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(error.message);
  }
}

export async function fetchUnreadCounts(): Promise<Record<string, number>> {
  const { data, error } = await supabase
    .from('outreach_emails')
    .select('creator_id')
    .eq('is_read', false)
    .eq('direction', 'received');

  if (error) {
    throw new Error(error.message);
  }

  const counts: Record<string, number> = {};
  for (const row of data) {
    counts[row.creator_id] = (counts[row.creator_id] || 0) + 1;
  }
  return counts;
}

export async function markAsRead(id: string) {
  const { error } = await supabase
    .from('outreach_emails')
    .update({ is_read: true })
    .eq('id', id);

  if (error) {
    throw new Error(error.message);
  }
}

export async function fetchLastSyncTimestamp(): Promise<number | null> {
  const { data } = await supabase
    .from('outreach_emails')
    .select('sent_at')
    .order('sent_at', { ascending: false })
    .limit(1)
    .single();

  return data ? Math.floor(new Date(data.sent_at).getTime() / 1000) : null;
}
