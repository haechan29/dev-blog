import { PostToolbarProps } from '@/features/post/ui/postToolbarProps';
import { createSlice } from '@reduxjs/toolkit';

const initialState: PostToolbarProps = {
  breadcrumb: [],
  headings: [],
  isContentVisible: false,
  isExpanded: false,
};

const postToolbarSlice = createSlice({
  name: 'postToolbar',
  initialState: initialState,
  reducers: {
    setBreadcrumb: (state, action) => {
      state.breadcrumb = action.payload;
    },
    setHeadings: (state, action) => {
      state.headings = action.payload;
    },
    setIsContentVisible: (state, action) => {
      state.isContentVisible = action.payload;
    },
    setIsExpanded: (state, action) => {
      state.isExpanded = action.payload;
    },
  },
});

export default postToolbarSlice.reducer;
export const {
  setBreadcrumb,
  setHeadings,
  setIsContentVisible,
  setIsExpanded,
} = postToolbarSlice.actions;
