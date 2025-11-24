import { writePostSteps } from '@/features/write/constants/writePostStep';

export type WritePostFormProps = {
  currentStepId: keyof typeof writePostSteps;
  isParseError: boolean;
  title: {
    value: string;
    isUserInput: boolean;
    isValid: boolean;
    maxLength: number;
  };
  tags: {
    value: string[];
    isUserInput: boolean;
    isValid: boolean;
    maxTagLength: number;
    maxTagsLength: number;
    delimiter: string;
  };
  password: {
    value: string;
    isValid: boolean;
    maxLength: number;
  };
  content: {
    value: string;
    isUserInput: boolean;
    isValid: boolean;
    maxLength: number;
  };
};
