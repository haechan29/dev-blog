import { writePostSteps } from '@/features/write/constants/writePostStep';
import { WritePost } from '@/features/write/domain/model/writePost';

export type WritePostProps = {
  currentStepId: keyof typeof writePostSteps;
  publishResult?: WritePost['publishResult'];
};

export function createProps(writePost: WritePost): WritePostProps {
  return {
    ...writePost,
  };
}
