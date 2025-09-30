import Heading from '@/features/post/domain/model/heading';
import PostToolbar from '@/features/post/domain/model/postToolbar';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: PostToolbar = {
  tag: null,
  selectedHeading: null,
  isInPostsPage: false,
  isHeaderVisible: false,
  isContentVisible: false,
  isExpanded: false,
  headings: [],
};

const postToolbarSlice = createSlice({
  name: 'postToolbar',
  initialState,
  reducers: {
    setTag: (state, action: PayloadAction<string | null>) => {
      state.tag = action.payload;
    },
    setSelectedHeading: (state, action: PayloadAction<Heading>) => {
      state.selectedHeading = action.payload;
    },
    setIsInPostsPage: (state, action: PayloadAction<boolean>) => {
      state.isInPostsPage = action.payload;
    },
    setIsHeaderVisible: (state, action: PayloadAction<boolean>) => {
      state.isHeaderVisible = action.payload;
    },
    setIsContentVisible: (state, action: PayloadAction<boolean>) => {
      state.isContentVisible = action.payload;
    },
    setIsExpanded: (state, action: PayloadAction<boolean>) => {
      state.isExpanded = action.payload;
    },
    setHeadings: (state, action: PayloadAction<Heading[]>) => {
      state.headings = action.payload;
    },
    setTitle: (state, action: PayloadAction<string>) => {
      state.title = action.payload;
    },
  },
});

export default postToolbarSlice.reducer;
export const {
  setIsInPostsPage,
  setIsHeaderVisible,
  setIsContentVisible,
  setIsExpanded,
  setTag,
  setTitle,
  setSelectedHeading,
  setHeadings,
} = postToolbarSlice.actions;
