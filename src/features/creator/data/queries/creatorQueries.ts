import { CreatorEntity } from '@/features/creator/data/entities/creatorEntities';
import { supabase } from '@/lib/supabase';
import 'server-only';

const SELECT_FIELDS =
  'id, channel_name, email, memo, status, created_at, last_mailed_at, user_id';

export async function fetchCreators() {
  const { data, error } = await supabase
    .from('creators')
    .select(SELECT_FIELDS)
    .order('last_mailed_at', { ascending: false, nullsFirst: false });

  if (error) {
    throw new Error(error.message);
  }

  const sorted = data.sort((a, b) => {
    if (a.status === 'rejected' && b.status !== 'rejected') return 1;
    if (a.status !== 'rejected' && b.status === 'rejected') return -1;
    return 0;
  });

  return sorted as CreatorEntity[];
}

export async function fetchCreator(id: string) {
  const { data, error } = await supabase
    .from('creators')
    .select(SELECT_FIELDS)
    .eq('id', id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data as CreatorEntity | null;
}

export async function createCreator({
  channelName,
  email,
  memo,
  userId,
}: {
  channelName: string;
  email: string;
  memo?: string;
  userId: string;
}) {
  const { data, error } = await supabase
    .from('creators')
    .insert({
      channel_name: channelName,
      email,
      memo: memo ?? null,
      user_id: userId,
    })
    .select(SELECT_FIELDS)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as CreatorEntity;
}

export async function updateCreator({
  id,
  channelName,
  email,
  memo,
  status,
}: {
  id: string;
  channelName?: string;
  email?: string;
  memo?: string | null;
  status?: CreatorEntity['status'];
}) {
  const updates: Partial<CreatorEntity> = {
    ...(channelName !== undefined && { channel_name: channelName }),
    ...(email !== undefined && { email }),
    ...(memo !== undefined && { memo }),
    ...(status !== undefined && { status }),
  };

  const { data, error } = await supabase
    .from('creators')
    .update(updates)
    .eq('id', id)
    .select(SELECT_FIELDS)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as CreatorEntity;
}

export async function updateLastMailedAt(id: string, timestamp: string) {
  const { error } = await supabase
    .from('creators')
    .update({ last_mailed_at: timestamp })
    .eq('id', id);

  if (error) {
    throw new Error(error.message);
  }
}

export async function deleteCreator(id: string) {
  const { error } = await supabase.from('creators').delete().eq('id', id);

  if (error) {
    throw new Error(error.message);
  }
}

export async function fetchCreatorByUserId(userId: string) {
  const { data, error } = await supabase
    .from('creators')
    .select(SELECT_FIELDS)
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data as CreatorEntity | null;
}
