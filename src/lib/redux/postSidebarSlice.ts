import PostSidebarProps from '@/features/post/ui/postSidebarProps';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: PostSidebarProps = {
  isVisible: false,
};

const postSidebarSlice = createSlice({
  name: 'postSidebar',
  initialState,
  reducers: {
    toggleIsVisible: state => {
      state.isVisible = !state.isVisible;
    },
  },
});

export default postSidebarSlice.reducer;
export const { toggleIsVisible } = postSidebarSlice.actions;
