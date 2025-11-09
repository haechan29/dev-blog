import { WritePostForm } from '@/features/write/domain/model/writePostForm';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: WritePostForm = {
  invalidField: null,
  title: {
    value: '',
    isUserInput: false,
    isEmptyAllowed: false,
    maxLength: 50,
  },
  tags: {
    value: [],
    isUserInput: false,
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
    isUserInput: false,
    isEmptyAllowed: false,
    maxLength: 50_000,
  },
  draft: {
    tags: [],
  },
};

const writePostFormSlice = createSlice({
  name: 'writePostForm',
  initialState,
  reducers: {
    setInvalidField: (state, action: PayloadAction<string | null>) => {
      state.invalidField = action.payload;
    },
    setDraftTitle: (state, action: PayloadAction<string>) => {
      state.draft.title = action.payload;
    },
    setDraftTags: (state, action: PayloadAction<string[]>) => {
      state.draft.tags = action.payload;
    },
    setDraftContent: (state, action: PayloadAction<string>) => {
      state.draft.content = action.payload;
    },
    setTitle: (
      state,
      action: PayloadAction<{
        value: string;
        isUserInput: boolean;
      }>
    ) => {
      const { value, isUserInput } = action.payload;
      state.title.value = value;
      state.title.isUserInput = isUserInput;
    },
    setTags: (
      state,
      action: PayloadAction<{
        value: string[];
        isUserInput: boolean;
      }>
    ) => {
      const { value, isUserInput } = action.payload;
      state.tags.value = value;
      state.tags.isUserInput = isUserInput;
    },
    setPassword: (state, action: PayloadAction<string>) => {
      state.password.value = action.payload;
    },
    setContent: (
      state,
      action: PayloadAction<{
        value: string;
        isUserInput: boolean;
      }>
    ) => {
      const { value, isUserInput } = action.payload;
      state.content.value = value;
      state.content.isUserInput = isUserInput;
    },
  },
});

export default writePostFormSlice.reducer;
export const {
  setInvalidField,
  setDraftTitle,
  setDraftTags,
  setDraftContent,
  setTitle,
  setTags,
  setPassword,
  setContent,
} = writePostFormSlice.actions;
