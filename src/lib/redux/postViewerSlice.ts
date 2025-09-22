import { PostViewer } from '@/features/post/domain/model/postViewer';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: PostViewer = {
  isCommentSectionVisible: false,
  isViewerMode: false,
  isControlBarVisible: true,
  currentIndex: 0,
  totalPages: 0,
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
    setIsControlBarVisible: (state, action: PayloadAction<boolean>) => {
      state.isControlBarVisible = action.payload;
    },
    setCurrentIndex: (state, action: PayloadAction<number>) => {
      state.currentIndex = action.payload;
    },
    nextPage: state => {
      state.currentIndex = Math.min(
        state.totalPages - 1,
        state.currentIndex + 1
      );
    },
    previousPage: state => {
      state.currentIndex = Math.max(0, state.currentIndex - 1);
    },
    setTotalPages: (state, action: PayloadAction<number>) => {
      state.totalPages = action.payload;
    },
  },
});

export default postViewerSlice.reducer;
export const {
  setIsCommentSectionVisible,
  setIsViewerMode,
  setIsControlBarVisible,
  setCurrentIndex,
  nextPage,
  previousPage,
  setTotalPages,
} = postViewerSlice.actions;
