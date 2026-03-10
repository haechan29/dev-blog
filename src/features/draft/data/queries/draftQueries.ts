import { DraftEntity } from '@/features/draft/data/entities/draftEntities';
import { DraftDto } from '@/features/draft/data/dto/draftDto';
import { toDto } from '@/features/draft/data/mapper/draftMapper';
import { supabase } from '@/lib/supabase';
import 'server-only';

const DRAFT_SELECT_FIELDS = `
  id,
  user_id,
  post_id,
  title,
  content_json,
  tags,
  created_at,
  updated_at
`;

export async function fetchDraftsByUserId(userId: string): Promise<DraftDto[]> {
  const { data, error } = await supabase
    .from('drafts')
    .select(DRAFT_SELECT_FIELDS)
    .eq('user_id', userId)
    .order('updated_at', { ascending: false })
    .order('id', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data as unknown as DraftEntity[]).map(toDto);
}

