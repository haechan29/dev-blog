import * as CreatorQueries from '@/features/creator/data/queries/creatorQueries';
import * as UserQueries from '@/features/user/data/queries/userQueries';
import 'server-only';

export async function createCreatorWithUser({
  channelName,
  email,
  memo,
}: {
  channelName: string;
  email: string;
  memo?: string;
}) {
  const userId = await UserQueries.createUserWithNickname(channelName);

  return CreatorQueries.createCreator({
    channelName,
    email,
    memo,
    userId,
  });
}
