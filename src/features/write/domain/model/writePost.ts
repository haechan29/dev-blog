import { WritePostSteps } from '@/features/write/domain/model/writePostStep';

export interface WritePost {
  currentStepId: keyof WritePostSteps;
  totalSteps: WritePostSteps;
  shouldValidate: boolean;
  publishResult?: 'success' | 'error';
}
