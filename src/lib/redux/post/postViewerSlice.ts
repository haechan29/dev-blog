import { PostViewer } from '@/features/postViewer/domain/model/postViewer';
import { Page } from '@/features/postViewer/domain/types/page';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: PostViewer = {
  isViewerMode: false,
  pages: [],
  currentPageIndex: null,
};

const postViewerSlice = createSlice({
  name: 'postViewer',
  initialState,
  reducers: {
    setIsViewerMode: (state, action: PayloadAction<boolean>) => {
      state.isViewerMode = action.payload;
    },
    setCurrentPageIndex: (state, action: PayloadAction<number>) => {
      state.currentPageIndex = action.payload;
    },
    nextPage: state => {
      state.currentPageIndex =
        state.currentPageIndex === null ? null : state.currentPageIndex + 1;
    },
    previousPage: state => {
      state.currentPageIndex =
        state.currentPageIndex === null ? null : state.currentPageIndex - 1;
    },
    setPages: (state, action: PayloadAction<Page[]>) => {
      state.pages = action.payload;
    },
  },
});

export default postViewerSlice.reducer;
export const {
  setIsViewerMode,
  setCurrentPageIndex,
  nextPage,
  previousPage,
  setPages,
} = postViewerSlice.actions;
