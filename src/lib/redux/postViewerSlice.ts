import { PostViewer } from '@/features/post/domain/model/postViewer';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: PostViewer = {
  isCommentSectionVisible: false,
  isViewerMode: false,
};

const postViewerSlice = createSlice({
  name: 'postViewer',
  initialState,
  reducers: {
    setIsCommentSectionVisible: (state, action: PayloadAction<boolean>) => {
      state.isCommentSectionVisible = action.payload;
    },
    setIsViewerMode: (state, action: PayloadAction<boolean>) => {
      state.isViewerMode = action.payload;
    },
  },
});

export default postViewerSlice.reducer;
export const { setIsCommentSectionVisible, setIsViewerMode } =
  postViewerSlice.actions;
