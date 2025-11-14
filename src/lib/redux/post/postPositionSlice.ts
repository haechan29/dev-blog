import PostPosition from '@/features/post/domain/model/postPosition';
import { Page } from '@/features/postViewer/domain/types/page';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: PostPosition = {
  pages: [],
  currentPageIndex: 0,
};

const postPositionSlice = createSlice({
  name: 'currentHeading',
  initialState,
  reducers: {
    setCurrentPageIndex: (state, action: PayloadAction<number>) => {
      state.currentPageIndex = action.payload;
    },
    nextPage: state => {
      state.currentPageIndex = state.currentPageIndex + 1;
    },
    previousPage: state => {
      state.currentPageIndex = state.currentPageIndex - 1;
    },
    setPages: (state, action: PayloadAction<Page[]>) => {
      state.pages = action.payload;
    },
  },
});

export default postPositionSlice.reducer;
export const { setCurrentPageIndex, nextPage, previousPage, setPages } =
  postPositionSlice.actions;
