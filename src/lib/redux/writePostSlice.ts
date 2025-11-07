import WritePost from '@/features/post/domain/model/writePost';
import { writePostSteps } from '@/features/write/constants/writePostStep';
import { ContentEditorStatus } from '@/features/write/domain/types/contentEditorStatus';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: WritePost = {
  writePostForm: {
    currentStepId: 'write',
    invalidField: null,
    title: {
      value: '',
      isEmptyAllowed: false,
      maxLength: 50,
    },
    tags: {
      value: [],
      isEmptyAllowed: true,
      maxTagLength: 30,
      maxTagsLength: 10,
      delimiter: '#',
    },
    password: {
      value: '',
      isEmptyAllowed: false,
      maxLength: 20,
    },
    content: {
      value: '',
      isEmptyAllowed: false,
      maxLength: 50_000,
    },
  },
  contentEditorStatus: {
    isFocused: false,
  },
};

const writePostSlice = createSlice({
  name: 'writePost',
  initialState,
  reducers: {
    setCurrentStepId: (
      state,
      action: PayloadAction<keyof typeof writePostSteps>
    ) => {
      state.writePostForm.currentStepId = action.payload;
    },
    setInvalidField: (state, action: PayloadAction<string | null>) => {
      state.writePostForm.invalidField = action.payload;
    },
    setTitle: (state, action: PayloadAction<string>) => {
      state.writePostForm.title.value = action.payload;
    },
    setTags: (state, action: PayloadAction<string[]>) => {
      state.writePostForm.tags.value = action.payload;
    },
    setPassword: (state, action: PayloadAction<string>) => {
      state.writePostForm.password.value = action.payload;
    },
    setContent: (state, action: PayloadAction<string>) => {
      state.writePostForm.content.value = action.payload;
    },
    setContentEditorStatus: (
      state,
      action: PayloadAction<ContentEditorStatus>
    ) => {
      state.contentEditorStatus = action.payload;
    },
  },
});

export default writePostSlice.reducer;
export const {
  setCurrentStepId,
  setInvalidField,
  setTitle,
  setTags,
  setPassword,
  setContent,
  setContentEditorStatus,
} = writePostSlice.actions;
