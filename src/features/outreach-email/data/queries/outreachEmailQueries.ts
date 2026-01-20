import { OutreachEmailEntity } from '@/features/outreach-email/data/entities/outreachEmailEntities';
import { supabase } from '@/lib/supabase';
import 'server-only';

const SELECT_FIELDS =
  'id, creator_id, subject, body, status, sent_at, responded_at, created_at, updated_at, creators(channel_name)';

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
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data as unknown as OutreachEmailEntity | null;
}

export async function createOutreachEmail({
  creatorId,
  subject,
  body,
}: {
  creatorId: string;
  subject: string;
  body: string;
}) {
  const { data, error } = await supabase
    .from('outreach_emails')
    .insert({
      creator_id: creatorId,
      subject,
      body,
    })
    .select(SELECT_FIELDS)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as unknown as OutreachEmailEntity;
}

export async function updateOutreachEmail({
  id,
  subject,
  body,
  status,
  respondedAt,
}: {
  id: string;
  subject?: string;
  body?: string;
  status?: OutreachEmailEntity['status'];
  respondedAt?: string | null;
}) {
  const updates: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
    ...(subject !== undefined && { subject }),
    ...(body !== undefined && { body }),
    ...(status !== undefined && { status }),
    ...(respondedAt !== undefined && { responded_at: respondedAt }),
  };

  const { data, error } = await supabase
    .from('outreach_emails')
    .update(updates)
    .eq('id', id)
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
