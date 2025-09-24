import { PostViewer } from '@/features/post/domain/model/postViewer';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: PostViewer = {
  isCommentSectionVisible: false,
  isViewerMode: false,
  isControlBarVisible: true,
  pageIndex: 0,
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
    setPageIndex: (state, action: PayloadAction<number>) => {
      state.pageIndex = action.payload;
    },
    nextPage: state => {
      state.pageIndex = Math.min(state.totalPages - 1, state.pageIndex + 1);
    },
    previousPage: state => {
      state.pageIndex = Math.max(0, state.pageIndex - 1);
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
  setPageIndex,
  nextPage,
  previousPage,
  setTotalPages,
} = postViewerSlice.actions;
