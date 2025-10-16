export interface WritePost {
  title: string;
  tags: string[];
  password: string;
  content: string;
  isTitleValid: boolean;
  isTagsValid: boolean;
  isPasswordValid: boolean;
  isContentValid: boolean;
  currentStepId: 'write' | 'upload';
  publishResult?: 'success' | 'error';
}
