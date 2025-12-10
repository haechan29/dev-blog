import { SeriesEntity } from '@/features/series/data/entities/seriesEntities';
import { toDto } from '@/features/series/data/mapper/seriesMapper';
import { supabase } from '@/lib/supabase';
import 'server-only';

export async function fetchSeries(seriesId: string) {
  const { data, error } = await supabase
    .from('series')
    .select(
      `
        id, 
        title, 
        description, 
        user_id, 
        created_at, 
        updated_at,
        users:user_id(nickname),
        posts(id, title, created_at, series_id, series_order))
      `
    )
    .eq('id', seriesId)
    .order('series_order', { referencedTable: 'posts', ascending: true })
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return toDto(data as unknown as SeriesEntity);
}

export async function fetchSeriesByUserId(userId: string) {
  const { data, error } = await supabase
    .from('series')
    .select(
      `
        id, 
        title, 
        description, 
        user_id, 
        created_at, 
        updated_at,
        users:user_id(nickname),
        posts(id, title, created_at, series_id, series_order))
      `
    )
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data as unknown as SeriesEntity[]).map(toDto);
}

export async function createSeries({
  title,
  description,
  userId,
}: {
  title: string;
  description: string | null;
  userId: string;
}) {
  const { error } = await supabase.from('series').insert({
    title,
    description,
    user_id: userId,
  });

  if (error) {
    throw new Error(error.message);
  }
}

export async function updateSeries({
  seriesId,
  title,
  description,
  userId,
}: {
  seriesId: string;
  title: string;
  description: string | null;
  userId: string;
}) {
  const { data, error } = await supabase
    .from('series')
    .update({
      title,
      description,
      updated_at: new Date().toISOString(),
    })
    .eq('id', seriesId)
    .eq('user_id', userId)
    .select(
      `
        id, 
        title, 
        description, 
        user_id, 
        created_at, 
        updated_at,
        users:user_id(nickname),
        posts(id, title, created_at, series_id, series_order))
      `
    )
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return toDto(data as unknown as SeriesEntity);
}

export async function deleteSeries(seriesId: string, userId: string) {
  const { error } = await supabase
    .from('series')
    .delete()
    .eq('id', seriesId)
    .eq('user_id', userId);

  if (error) {
    throw new Error(error.message);
  }
}
