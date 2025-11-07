import { WritePostForm } from '@/features/write/domain/model/writePostForm';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: WritePostForm = {
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
};

const writePostFormSlice = createSlice({
  name: 'writePostForm',
  initialState,
  reducers: {
    setInvalidField: (state, action: PayloadAction<string | null>) => {
      state.invalidField = action.payload;
    },
    setDraft: (state, action: PayloadAction<string>) => {
      state.draft = action.payload;
    },
    setTitle: (state, action: PayloadAction<string>) => {
      state.title.value = action.payload;
    },
    setTags: (state, action: PayloadAction<string[]>) => {
      state.tags.value = action.payload;
    },
    setPassword: (state, action: PayloadAction<string>) => {
      state.password.value = action.payload;
    },
    setContent: (state, action: PayloadAction<string>) => {
      state.content.value = action.payload;
    },
  },
});

export default writePostFormSlice.reducer;
export const {
  setInvalidField,
  setDraft,
  setTitle,
  setTags,
  setPassword,
  setContent,
} = writePostFormSlice.actions;
