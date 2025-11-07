export interface ContentEditorBlurStatus {
  isFocused: false;
}

export interface ContentEditorFocusStatus {
  isFocused: true;
  scrollRatio: number;
}

export type ContentEditorStatus =
  | ContentEditorBlurStatus
  | ContentEditorFocusStatus;
