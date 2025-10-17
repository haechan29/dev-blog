export type WritePostStep = {
  id: 'write' | 'upload';
  toolbarText: string;
  actionButtonText: string;
  action: string;
};

export const WRITE_STEP: WritePostStep = {
  id: 'write',
  toolbarText: '글 쓰기',
  actionButtonText: '다음',
  action: 'next',
};

export const UPLOAD_STEP: WritePostStep = {
  id: 'upload',
  toolbarText: '업로드하기',
  actionButtonText: '완료',
  action: 'publish',
};

export const WRITE_POST_STEPS = new Map<WritePostStep['id'], WritePostStep>([
  ['write', WRITE_STEP],
  ['upload', UPLOAD_STEP],
]);
