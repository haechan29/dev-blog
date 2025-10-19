import { WritePost } from '@/features/write/domain/model/writePost';
import { WritePostSteps } from '@/features/write/domain/model/writePostStep';

export type WritePostProps = {
  currentStepId: keyof WritePostSteps;
  publishResult?: WritePost['publishResult'];
};

export function createProps(writePost: WritePost): WritePostProps {
  return {
    ...writePost,
  };
}
