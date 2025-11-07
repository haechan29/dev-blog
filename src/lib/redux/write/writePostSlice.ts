import WritePost from '@/features/post/domain/model/writePost';
import { ContentEditorStatus } from '@/features/write/domain/types/contentEditorStatus';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: WritePost = {
  contentEditorStatus: {
    isFocused: false,
    scrollRatio: 0,
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
      const prevScrollRatio = state.contentEditorStatus.scrollRatio;
      const { isFocused, scrollRatio } = action.payload;
      state.contentEditorStatus = {
        isFocused,
        scrollRatio: scrollRatio ?? prevScrollRatio,
      };
    },
  },
});

export default writePostSlice.reducer;
export const { setContentEditorStatus } = writePostSlice.actions;
