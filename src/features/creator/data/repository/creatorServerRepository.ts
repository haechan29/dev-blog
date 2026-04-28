import { toDto } from '@/features/creator/data/mapper/creatorMapper';
import * as CreatorQueries from '@/features/creator/data/queries/creatorQueries';
import * as CreatorUsecases from '@/features/creator/data/usecases/creatorUsecase';
import 'server-only';

export async function getCreators() {
  const creators = await CreatorQueries.fetchCreators();
  return creators.map(toDto);
}

export async function getCreator(id: string) {
  const creator = await CreatorQueries.fetchCreator(id);
  return creator ? toDto(creator) : null;
}

export async function getCreatorByUserId(userId: string) {
  const creator = await CreatorQueries.fetchCreatorByUserId(userId);
  return creator ? toDto(creator) : null;
}

export async function createCreator(params: {
  channelName: string;
  email: string;
  memo?: string;
}) {
  return await CreatorUsecases.createCreatorWithUser(params);
}

export async function updateCreator(params: {
  id: string;
  channelName?: string;
  email?: string;
  memo?: string | null;
  status?: 'pending' | 'sent' | 'accepted' | 'rejected';
}) {
  const creator = await CreatorQueries.updateCreator(params);
  return toDto(creator);
}

export async function deleteCreator(id: string) {
  await CreatorQueries.deleteCreator(id);
}
