import { DraftDto } from '@/features/draft/data/dto/draftDto';
import { DraftEntity } from '@/features/draft/data/entities/draftEntities';
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

export async function createDraft({
  userId,
  postId,
  title,
  contentJson,
  tags,
}: {
  userId: string;
  postId: string | null;
  title: string;
  contentJson: object | null;
  tags: string[];
}): Promise<DraftDto> {
  const { data, error } = await supabase
    .from('drafts')
    .insert({
      user_id: userId,
      post_id: postId,
      title,
      content_json: contentJson,
      tags,
    })
    .select(DRAFT_SELECT_FIELDS)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return toDto(data as unknown as DraftEntity);
}

export async function fetchDraftOwnership(
  draftId: string
): Promise<{ id: string; userId: string } | null> {
  const { data, error } = await supabase
    .from('drafts')
    .select('id,user_id')
    .eq('id', draftId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    return null;
  }

  return { id: data.id as string, userId: data.user_id as string };
}

export async function updateDraft({
  draftId,
  postId,
  title,
  contentJson,
  tags,
}: {
  draftId: string;
  postId?: string | null;
  title?: string;
  contentJson?: object | null;
  tags?: string[];
}): Promise<DraftDto> {
  const update: Record<string, unknown> = {
    ...(postId !== undefined && { post_id: postId }),
    ...(title !== undefined && { title }),
    ...(contentJson !== undefined && { content_json: contentJson }),
    ...(tags !== undefined && { tags }),
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from('drafts')
    .update(update)
    .eq('id', draftId)
    .select(DRAFT_SELECT_FIELDS)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return toDto(data as unknown as DraftEntity);
}

export async function deleteDraft(draftId: string): Promise<void> {
  const { error } = await supabase.from('drafts').delete().eq('id', draftId);

  if (error) {
    throw new Error(error.message);
  }
}
