import { supabase } from '@/lib/supabase';
import 'server-only';

const TAG_LIMIT = 10;

export async function fetchTagNames(query: string) {
  let request = supabase
    .from('tags')
    .select('name')
    .order('post_count', { ascending: false })
    .order('name', { ascending: true })
    .limit(TAG_LIMIT);

  if (query.length > 0) {
    request = request.ilike('name', `%${query}%`);
  }

  const { data, error } = await request;

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map(tag => tag.name);
}
