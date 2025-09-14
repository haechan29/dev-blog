import PostToolbarProps from '@/features/post/ui/postToolbarProps';
import { createSlice } from '@reduxjs/toolkit';

const initialState: PostToolbarProps = {
  breadcrumb: [],
  selectedTitle: null,
  titles: [],
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
    setSelectedTitle: (state, action) => {
      state.selectedTitle = action.payload;
    },
    setTitles: (state, action) => {
      state.titles = action.payload;
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
  setSelectedTitle,
  setTitles,
  setIsContentVisible,
  setIsExpanded,
} = postToolbarSlice.actions;
