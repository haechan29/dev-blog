import { DraftDto } from '@/features/draft/data/dto/draftDto';
import { api } from '@/lib/api';

export async function getDrafts(): Promise<DraftDto[]> {
  const response = await api.get('/api/drafts');
  return response.data;
}

export async function createDraft(requestDto: {
  postId?: string | null;
  title?: string;
  contentJson?: object | null;
  tags?: string[];
}): Promise<DraftDto> {
  const response = await api.post('/api/drafts', requestDto);
  return response.data;
}

export async function updateDraft({
  draftId,
  ...requestBody
}: {
  draftId: string;
  postId?: string | null;
  title?: string;
  contentJson?: object | null;
  tags?: string[];
}): Promise<DraftDto> {
  const response = await api.patch(`/api/drafts/${draftId}`, requestBody);
  return response.data;
}

export async function deleteDraft(draftId: string): Promise<void> {
  await api.delete(`/api/drafts/${draftId}`);
}
