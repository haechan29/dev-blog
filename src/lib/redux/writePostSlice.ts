import WritePost from '@/features/post/domain/model/writePost';
import { ContentEditorStatus } from '@/features/write/domain/types/contentEditorStatus';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: WritePost = {
  contentEditorStatus: {
    isFocused: false,
  },
};

const writePostSlice = createSlice({
  name: 'writePost',
  initialState,
  reducers: {
    setContentEditorStatus: (
      state,
      action: PayloadAction<ContentEditorStatus>
    ) => {
      state.contentEditorStatus = action.payload;
    },
  },
});

export default writePostSlice.reducer;
export const { setContentEditorStatus } = writePostSlice.actions;
