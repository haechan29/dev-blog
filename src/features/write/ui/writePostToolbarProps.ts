import { WritePost } from '@/features/write/domain/model/writePost';

export type WritePostToolbarProps = {
  toolbarTexts: {
    isCurrentStep: boolean;
    content: string;
  }[];
  actionButtonText: string;
};

export function createProps(writePost: WritePost): WritePostToolbarProps {
  const currentStep = writePost.totalSteps[writePost.currentStepId]!;
  return {
    toolbarTexts: Object.values(writePost.totalSteps).map(step => ({
      isCurrentStep: step.id === currentStep.id,
      content: step.toolbarText,
    })),
    ...currentStep,
  };
}
