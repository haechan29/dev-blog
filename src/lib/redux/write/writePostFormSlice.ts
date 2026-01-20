import { PostVisibility } from '@/features/post/domain/types/postVisibility';
import { WritePostForm } from '@/features/write/domain/model/writePostForm';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: WritePostForm = {
  invalidField: null,
  isParseError: false,
  visibility: 'public',
  title: {
    value: '',
    isUserInput: false,
    isEmptyAllowed: false,
    maxLength: 100,
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
};

const writePostFormSlice = createSlice({
  name: 'writePostForm',
  initialState,
  reducers: {
    setInvalidField: (state, action: PayloadAction<string | null>) => {
      state.invalidField = action.payload;
    },
    setIsParseError: (state, action: PayloadAction<boolean>) => {
      state.isParseError = action.payload;
    },
    setVisibility: (state, action: PayloadAction<PostVisibility>) => {
      state.visibility = action.payload;
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
  setIsParseError,
  setVisibility,
  setTitle,
  setTags,
  setPassword,
  setContent,
} = writePostFormSlice.actions;
