import { writePostSteps } from '@/features/write/constants/writePostStep';

export interface WritePostToolbar {
  currentStepId: keyof typeof writePostSteps;
}
