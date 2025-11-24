import { writePostSteps } from '@/features/write/constants/writePostStep';
import { ContentEditorStatus } from '@/features/write/domain/types/contentEditorStatus';

export default interface WritePost {
  currentStepId: keyof typeof writePostSteps;
  contentEditorStatus: ContentEditorStatus;
}
