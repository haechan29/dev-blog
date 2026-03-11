import { DraftDto } from '@/features/draft/data/dto/draftDto';
import * as DraftUsecase from '@/features/draft/data/usecases/draftUsecase';
import 'server-only';

export async function getDrafts(): Promise<DraftDto[]> {
  return await DraftUsecase.getDrafts();
}
