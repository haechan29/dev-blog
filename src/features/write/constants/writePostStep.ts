import { WritePostForm } from '@/features/write/domain/model/writePostForm';

interface WritePostStep {
  id: string;
  toolbarText: string;
  actionButtonText: string;
  action: string;
  fields: (keyof WritePostForm)[];
}

export const writeStep: WritePostStep = {
  id: 'write',
  toolbarText: '글 쓰기',
  actionButtonText: '다음',
  action: 'next',
  fields: ['content'],
};

export const uploadStep: WritePostStep = {
  id: 'upload',
  toolbarText: '업로드하기',
  actionButtonText: '완료',
  action: 'publish',
  fields: ['title', 'tags', 'password'],
};

export const writePostSteps = {
  write: writeStep,
  upload: uploadStep,
};
