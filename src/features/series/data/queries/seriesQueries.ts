import { SeriesEntity } from '@/features/series/data/entities/seriesEntities';
import { toDto } from '@/features/series/data/mapper/seriesMapper';
import { supabase } from '@/lib/supabase';
import 'server-only';

export async function fetchSeriesByUserId(userId: string) {
  const { data, error } = await supabase
    .from('series')
    .select(
      'id, title, description, user_id, created_at, updated_at, users:user_id(nickname)'
    )
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data as unknown as SeriesEntity[]).map(toDto);
}
