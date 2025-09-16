import PostSidebarProps from '@/features/post/ui/postSidebarProps';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: PostSidebarProps = {
  isVisible: false,
};

const postSidebarSlice = createSlice({
  name: 'postSidebar',
  initialState,
  reducers: {
    setIsVisible: (state, action: PayloadAction<boolean>) => {
      state.isVisible = action.payload;
    },
  },
});

export default postSidebarSlice.reducer;
export const { setIsVisible } = postSidebarSlice.actions;
