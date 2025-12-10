import Heading from '@/features/post/domain/model/heading';
import PostToolbar from '@/features/post/domain/model/postToolbar';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: PostToolbar = {
  isHeaderVisible: false,
  isContentVisible: false,
  isScrollingDown: false,
  isExpanded: false,
  headings: [],
};

const postToolbarSlice = createSlice({
  name: 'postToolbar',
  initialState,
  reducers: {
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
  setHeadings,
  setTitle,
} = postToolbarSlice.actions;
