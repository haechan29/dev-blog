import { PostViewer } from '@/features/postViewer/domain/model/postViewer';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: PostViewer = {
  isCommentSectionVisible: false,
  isViewerMode: false,
  isToolbarExpanded: false,
  advanceMode: null,
  isMouseOnToolbar: false,
  isMouseOnControlBar: false,
  isMouseMoved: false,
  isTouched: false,
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
  },
});

export default postViewerSlice.reducer;
export const {
  setIsCommentSectionVisible,
  setIsViewerMode,
  setIsToolbarExpanded,
  setAdvanceMode,
  setIsMouseOnToolbar,
  setIsMouseOnControlBar,
  setIsMouseMoved,
  setIsTouched,
} = postViewerSlice.actions;
