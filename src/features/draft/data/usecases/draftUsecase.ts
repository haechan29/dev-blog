import { UnauthorizedError } from '@/errors/errors';
import { toDto } from '@/features/draft/data/mapper/draftMapper';
import * as DraftQueries from '@/features/draft/data/queries/draftQueries';
import { getUserId } from '@/lib/user';
import 'server-only';

export async function getDrafts() {
  const userId = await getUserId();
  if (!userId) {
    throw new UnauthorizedError('인증되지 않은 요청입니다');
  }

  const drafts = await DraftQueries.fetchDraftsByUserId(userId);
  return drafts.map(toDto);
}
