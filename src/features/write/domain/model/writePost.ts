import { WritePostStep } from '@/features/write/domain/model/writePostStep';

export interface WritePost {
  title: string;
  tags: string[];
  password: string;
  content: string;
  isTitleValid: boolean;
  isTagsValid: boolean;
  isPasswordValid: boolean;
  isContentValid: boolean;
  currentStep: WritePostStep['id'];
  totalSteps: Map<WritePostStep['id'], WritePostStep>;
  publishResult?: 'success' | 'error';
}
