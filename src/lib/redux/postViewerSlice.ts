import { PostViewer } from '@/features/postViewer/domain/model/postViewer';
import { Padding } from '@/types/padding';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: PostViewer = {
  isCommentSectionVisible: false,
  isViewerMode: false,
  isToolbarExpanded: false,
  advanceMode: null,
  fullscreenScale: 1.5,
  paddingInRem: {
    top: 5,
    right: 5,
    bottom: 5,
    left: 5,
  },
  isMouseOnToolbar: false,
  isMouseOnControlBar: false,
  isMouseMoved: false,
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
    setIsToolbarExpanded: (state, action: PayloadAction<boolean>) => {
      state.isToolbarExpanded = action.payload;
    },
    setAdvanceMode: (
      state,
      action: PayloadAction<PostViewer['advanceMode']>
    ) => {
      state.advanceMode = action.payload;
    },
    setFullscreenScale: (state, action: PayloadAction<number>) => {
      state.fullscreenScale = action.payload;
    },
    setPaddingInRem: (state, action: PayloadAction<Padding>) => {
      state.paddingInRem = action.payload;
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
  },
});

export default postViewerSlice.reducer;
export const {
  setIsCommentSectionVisible,
  setIsViewerMode,
  setIsToolbarExpanded,
  setAdvanceMode,
  setFullscreenScale,
  setPaddingInRem,
  setIsMouseOnToolbar,
  setIsMouseOnControlBar,
  setIsMouseMoved,
} = postViewerSlice.actions;
