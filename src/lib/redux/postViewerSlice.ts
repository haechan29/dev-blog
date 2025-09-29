import { PostViewer } from '@/features/postViewer/domain/model/postViewer';
import { HeadingPageMapping } from '@/features/postViewer/domain/types/headingPageMapping';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: PostViewer = {
  isCommentSectionVisible: false,
  isViewerMode: false,
  areBarsVisible: true,
  paging: null,
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
    setPageIndex: (state, action: PayloadAction<number>) => {
      state.paging = {
        index: action.payload,
        total: state.paging!.total,
      };
    },
    nextPage: state => {
      state.paging = {
        index: state.paging!.index + 1,
        total: state.paging!.total,
      };
    },
    previousPage: state => {
      state.paging = {
        index: state.paging!.index - 1,
        total: state.paging!.total,
      };
    },
    setPaging: (state, action: PayloadAction<PostViewer['paging']>) => {
      state.paging = action.payload;
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
    setHeadingPageMapping: (
      state,
      action: PayloadAction<HeadingPageMapping>
    ) => {
      state.headingPageMapping = action.payload;
    },
  },
});

export default postViewerSlice.reducer;
export const {
  setIsCommentSectionVisible,
  setIsViewerMode,
  setAreBarsVisible,
  setPageIndex,
  nextPage,
  previousPage,
  setPaging,
  setAdvanceMode,
  setFullscreenScale,
  setHeadingPageMapping,
} = postViewerSlice.actions;
