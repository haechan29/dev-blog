import { CreatorEntity } from '@/features/creator/data/entities/creatorEntities';
import { supabase } from '@/lib/supabase';
import 'server-only';

export async function fetchCreators() {
  const { data, error } = await supabase
    .from('creators')
    .select('id, channel_name, email, memo, status, created_at')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data as CreatorEntity[];
}

export async function fetchCreator(id: string) {
  const { data, error } = await supabase
    .from('creators')
    .select('id, channel_name, email, memo, status, created_at')
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
}: {
  channelName: string;
  email: string;
  memo?: string;
}) {
  const { data, error } = await supabase
    .from('creators')
    .insert({
      channel_name: channelName,
      email,
      memo: memo ?? null,
    })
    .select('id, channel_name, email, memo, status, created_at')
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
    .select('id, channel_name, email, memo, status, created_at')
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as CreatorEntity;
}

export async function deleteCreator(id: string) {
  const { error } = await supabase.from('creators').delete().eq('id', id);

  if (error) {
    throw new Error(error.message);
  }
}
