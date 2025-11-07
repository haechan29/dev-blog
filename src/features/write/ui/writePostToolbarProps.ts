import { writePostSteps } from '@/features/write/constants/writePostStep';
import WritePost from '@/features/write/domain/model/writePost';

export type WritePostToolbarProps = {
  toolbarTexts: {
    isCurrentStep: boolean;
    content: string;
  }[];
  actionButtonText: string;
};

export function createProps(writePost: WritePost): WritePostToolbarProps {
  const currentStep = writePostSteps[writePost.currentStepId];
  return {
    toolbarTexts: Object.values(writePostSteps).map(step => ({
      isCurrentStep: step.id === currentStep.id,
      content: step.toolbarText,
    })),
    ...currentStep,
  };
}
