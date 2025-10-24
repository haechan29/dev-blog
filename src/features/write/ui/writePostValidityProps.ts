import { writePostSteps } from '@/features/write/constants/writePostStep';
import { WritePost } from '@/features/write/domain/model/writePost';
import {
  validate,
  WritePostForm,
} from '@/features/write/domain/model/writePostForm';

export interface WritePostValidityProps {
  invalidField: keyof WritePostForm | null;
}

export function createProps(
  writePost: WritePost,
  writePostForm: WritePostForm
): WritePostValidityProps {
  const currentStep = writePostSteps[writePost.currentStepId];
  const invalidField =
    currentStep.fields.find(field => !validate(writePostForm, field)) ?? null;
  return {
    invalidField: writePost.shouldValidate ? invalidField : null,
  };
}
