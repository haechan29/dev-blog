import { PostViewer } from '@/features/postViewer/domain/model/postViewer';
import { Page } from '@/features/postViewer/domain/types/page';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: PostViewer = {
  isViewerMode: false,
  isToolbarExpanded: false,
  isMouseOnToolbar: false,
  isMouseOnControlBar: false,
  isMouseMoved: false,
  isTouched: false,
  isToolbarTouched: false,
  isControlBarTouched: false,
  isRotationFinished: false,
  pages: [],
  currentPageIndex: null,
};

const postViewerSlice = createSlice({
  name: 'postViewer',
  initialState,
  reducers: {
    setIsViewerMode: (state, action: PayloadAction<boolean>) => {
      state.isViewerMode = action.payload;
      if (!action.payload) {
        state.isMouseOnToolbar = false;
        state.isMouseOnControlBar = false;
        state.isMouseMoved = false;
        state.isToolbarExpanded = false;
        state.isTouched = false;
        state.isToolbarTouched = false;
        state.isControlBarTouched = false;
        state.isRotationFinished = false;
      }
    },
    setIsToolbarExpanded: (state, action: PayloadAction<boolean>) => {
      state.isToolbarExpanded = action.payload;
    },
    setIsMouseOnToolbar: (state, action: PayloadAction<boolean>) => {
      state.isMouseOnToolbar = action.payload;
    },
    setIsMouseOnControlBar: (state, action: PayloadAction<boolean>) => {
      state.isMouseOnControlBar = action.payload;
    },
    setIsMouseMoved: (state, action: PayloadAction<boolean>) => {
      state.isMouseMoved = action.payload;
    },
    setIsTouched: (state, action: PayloadAction<boolean>) => {
      state.isTouched = action.payload;
    },
    setIsToolbarTouched: (state, action: PayloadAction<boolean>) => {
      state.isToolbarTouched = action.payload;
    },
    setIsControlBarTouched: (state, action: PayloadAction<boolean>) => {
      state.isControlBarTouched = action.payload;
    },
    setIsRotationFinished: (state, action: PayloadAction<boolean>) => {
      state.isRotationFinished = action.payload;
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
  setIsToolbarExpanded,
  setIsMouseOnToolbar,
  setIsMouseOnControlBar,
  setIsMouseMoved,
  setIsTouched,
  setIsToolbarTouched,
  setIsControlBarTouched,
  setIsRotationFinished,
  setCurrentPageIndex,
  nextPage,
  previousPage,
  setPages,
} = postViewerSlice.actions;
