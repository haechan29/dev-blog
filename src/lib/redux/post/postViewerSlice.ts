import { PostViewer } from '@/features/postViewer/domain/model/postViewer';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: PostViewer = {
  areCommentsVisible: false,
  isViewerMode: false,
  isToolbarExpanded: false,
  isMouseOnToolbar: false,
  isMouseOnControlBar: false,
  isMouseMoved: false,
  isTouched: false,
  isToolbarTouched: false,
  isControlBarTouched: false,
  isRotationFinished: false,
};

const postViewerSlice = createSlice({
  name: 'postViewer',
  initialState,
  reducers: {
    setAreCommentsVisible: (state, action: PayloadAction<boolean>) => {
      state.areCommentsVisible = action.payload;
    },
    setIsViewerMode: (state, action: PayloadAction<boolean>) => {
      state.isViewerMode = action.payload;
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
  },
});

export default postViewerSlice.reducer;
export const {
  setAreCommentsVisible,
  setIsViewerMode,
  setIsToolbarExpanded,
  setIsMouseOnToolbar,
  setIsMouseOnControlBar,
  setIsMouseMoved,
  setIsTouched,
  setIsToolbarTouched,
  setIsControlBarTouched,
  setIsRotationFinished,
} = postViewerSlice.actions;
