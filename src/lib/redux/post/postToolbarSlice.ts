import Heading from '@/features/post/domain/model/heading';
import PostToolbar from '@/features/post/domain/model/postToolbar';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: PostToolbar = {
  tag: null,
  isHeaderVisible: false,
  isContentVisible: false,
  isScrollingDown: false,
  isExpanded: false,
  headings: [],
  currentHeading: null,
};

const postToolbarSlice = createSlice({
  name: 'postToolbar',
  initialState,
  reducers: {
    setTag: (state, action: PayloadAction<string | null>) => {
      state.tag = action.payload;
    },
    setIsHeaderVisible: (state, action: PayloadAction<boolean>) => {
      state.isHeaderVisible = action.payload;
    },
    setIsContentVisible: (state, action: PayloadAction<boolean>) => {
      state.isContentVisible = action.payload;
    },
    setIsScrollingDown: (state, action: PayloadAction<boolean>) => {
      state.isScrollingDown = action.payload;
    },
    setIsExpanded: (state, action: PayloadAction<boolean>) => {
      state.isExpanded = action.payload;
    },
    setHeadings: (state, action: PayloadAction<Heading[]>) => {
      state.headings = action.payload;
    },
    setCurrentHeading: (state, action: PayloadAction<Heading | null>) => {
      state.currentHeading = action.payload;
    },
    setTitle: (state, action: PayloadAction<string>) => {
      state.title = action.payload;
    },
  },
});

export default postToolbarSlice.reducer;
export const {
  setIsHeaderVisible,
  setIsContentVisible,
  setIsScrollingDown,
  setIsExpanded,
  setTag,
  setHeadings,
  setCurrentHeading,
  setTitle,
} = postToolbarSlice.actions;
