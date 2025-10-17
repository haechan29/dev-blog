import { WritePost } from '@/features/write/domain/model/writePost';
import { WritePostSteps } from '@/features/write/domain/model/writePostStep';
import { WritePostToolbarProps } from '@/features/write/ui/writePostToolbarProps';

export type WritePostProps = {
  title: string;
  tags: string;
  password: string;
  content: string;
  invalidField: 'title' | 'tags' | 'password' | 'content' | null;
  currentStepId: keyof WritePostSteps;
  publishResult?: WritePost['publishResult'];
} & WritePostToolbarProps;

export function createProps(writePost: WritePost): WritePostProps {
  const currentStep = writePost.totalSteps[writePost.currentStepId]!;
  return {
    title: writePost.title,
    tags: writePost.tags.map(tag => `#${tag}`).join(' '),
    password: writePost.password,
    content: writePost.content,
    invalidField: getInvalidField(writePost),
    currentStepId: writePost.currentStepId,
    toolbarTexts: Object.values(writePost.totalSteps).map(step => ({
      isCurrentStep: step.id === currentStep.id,
      content: step.toolbarText,
    })),
    ...currentStep,
  };
}

function getInvalidField(writePost: WritePost) {
  if (!writePost.isTitleValid) return 'title';
  else if (!writePost.isTagsValid) return 'tags';
  else if (!writePost.isPasswordValid) return 'password';
  else if (!writePost.isContentValid) return 'content';
  return null;
}
