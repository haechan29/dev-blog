import { PostViewer } from '@/features/postViewer/domain/model/postViewer';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: PostViewer = {
  isCommentSectionVisible: false,
  isViewerMode: false,
  areBarsVisible: true,
  isToolbarExpanded: false,
  advanceMode: null,
  fullscreenScale: 1.5,
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
    setAreBarsVisible: (state, action: PayloadAction<boolean>) => {
      state.areBarsVisible = action.payload;
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
  },
});

export default postViewerSlice.reducer;
export const {
  setIsCommentSectionVisible,
  setIsViewerMode,
  setAreBarsVisible,
  setIsToolbarExpanded,
  setAdvanceMode,
  setFullscreenScale,
} = postViewerSlice.actions;
