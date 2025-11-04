import { JSX } from 'react';

type IdleContent = {
  status: 'idle';
};
type ErrorContent = {
  status: 'error';
};
type LoadingContent = {
  status: 'loading';
};
type SuccessContent = {
  status: 'success';
  value: JSX.Element;
};
export type Content =
  | IdleContent
  | ErrorContent
  | LoadingContent
  | SuccessContent;
