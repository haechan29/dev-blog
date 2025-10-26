import { writePostSteps } from '@/features/write/constants/writePostStep';
import { WritePostToolbar } from '@/features/write/domain/model/writePostToolbar';

export type WritePostToolbarProps = {
  toolbarTexts: {
    isCurrentStep: boolean;
    content: string;
  }[];
  actionButtonText: string;
};

export function createProps(
  writePostToolbar: WritePostToolbar
): WritePostToolbarProps {
  const currentStep = writePostSteps[writePostToolbar.currentStepId];
  return {
    toolbarTexts: Object.values(writePostSteps).map(step => ({
      isCurrentStep: step.id === currentStep.id,
      content: step.toolbarText,
    })),
    ...currentStep,
  };
}
