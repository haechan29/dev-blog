import { writePostSteps } from '@/features/write/constants/writePostStep';

export interface WritePost {
  currentStepId: keyof typeof writePostSteps;
  shouldValidate: boolean;
  publishResult?: 'success' | 'error';
}
