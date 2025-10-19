import { WritePostForm } from '@/features/write/domain/model/writePostForm';

export interface WritePostStep {
  id: string;
  toolbarText: string;
  actionButtonText: string;
  action: string;
  fields: (keyof WritePostForm)[];
}

export type WritePostSteps = Record<'write' | 'upload', WritePostStep>;

export const WRITE_STEP: WritePostStep = {
  id: 'write',
  toolbarText: '글 쓰기',
  actionButtonText: '다음',
  action: 'next',
  fields: ['content'],
};

export const UPLOAD_STEP: WritePostStep = {
  id: 'upload',
  toolbarText: '업로드하기',
  actionButtonText: '완료',
  action: 'publish',
  fields: ['title', 'tags', 'password'],
};

export const WRITE_POST_STEPS: WritePostSteps = {
  write: WRITE_STEP,
  upload: UPLOAD_STEP,
};
