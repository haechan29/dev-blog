import { WritePostSteps } from '@/features/write/domain/model/writePostStep';

export interface WritePost {
  title: string;
  tags: string[];
  password: string;
  content: string;
  isTitleValid: boolean;
  isTagsValid: boolean;
  isPasswordValid: boolean;
  isContentValid: boolean;
  currentStepId: keyof WritePostSteps;
  totalSteps: WritePostSteps;
  publishResult?: 'success' | 'error';
}
