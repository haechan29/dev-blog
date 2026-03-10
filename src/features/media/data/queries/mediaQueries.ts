import { supabase } from '@/lib/supabase';
import 'server-only';

export async function getUsageSince(
  userId: string,
  since: Date
): Promise<number> {
  const { data, error } = await supabase
    .from('media')
    .select('size_bytes')
    .eq('user_id', userId)
    .gte('created_at', since.toISOString());

  if (error) {
    throw new Error(error.message);
  }

  return data.reduce((sum, row) => sum + (row.size_bytes || 0), 0);
}

export async function createMedia({
  url,
  sizeBytes,
  userId,
  type,
}: {
  url: string;
  sizeBytes: number;
  userId: string;
  type: 'image' | 'audio';
}) {
  const { data, error } = await supabase
    .from('media')
    .insert({
      url,
      size_bytes: sizeBytes,
      user_id: userId,
      type,
    })
    .select('id')
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data.id;
}
