import { PostViewer } from '@/features/postViewer/domain/model/postViewer';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: PostViewer = {
  isCommentSectionVisible: false,
  isViewerMode: false,
  isControlBarVisible: true,
  paging: null,
  advanceMode: null,
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
  setPaging,
  setAdvanceMode,
} = postViewerSlice.actions;
