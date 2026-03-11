import { UnauthorizedError } from '@/errors/errors';
import { DraftDto } from '@/features/draft/data/dto/draftDto';
import * as DraftQueries from '@/features/draft/data/queries/draftQueries';
import { getUserId } from '@/lib/user';
import 'server-only';

export async function getDrafts(): Promise<DraftDto[]> {
  const userId = await getUserId();
  if (!userId) {
    throw new UnauthorizedError('인증되지 않은 요청입니다');
  }

  return await DraftQueries.fetchDraftsByUserId(userId);
}
