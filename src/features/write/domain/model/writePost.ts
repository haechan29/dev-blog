import { writePostSteps } from '@/features/write/constants/writePostStep';

export interface WritePost {
  currentStepId: keyof typeof writePostSteps;
  publishResult?: 'success' | 'error';
}
