import { WritePost } from '@/features/write/domain/model/writePost';

interface WritePostStepProps {
  toolbarText: string;
  actionButtonText: string;
  action: string;
}

interface WriteStepProps extends WritePostStepProps {
  toolbarText: '글 쓰기';
  actionButtonText: '다음';
  action: 'next';
}

interface UploadStepProps extends WritePostStepProps {
  toolbarText: '업로드하기';
  actionButtonText: '완료';
  action: 'publish';
}

export type WritePostStepsProps = WriteStepProps | UploadStepProps;

export function createProps(
  id: WritePost['currentStepId']
): WritePostStepsProps {
  switch (id) {
    case 'write':
      return {
        toolbarText: '글 쓰기',
        actionButtonText: '다음',
        action: 'next',
      };
    case 'upload':
      return {
        toolbarText: '업로드하기',
        actionButtonText: '완료',
        action: 'publish',
      };
  }
}
