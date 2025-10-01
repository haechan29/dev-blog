import Heading from '@/features/post/domain/model/heading';
import PostPosition from '@/features/post/domain/model/postPosition';
import { HeadingPageMapping } from '@/features/postViewer/domain/types/headingPageMapping';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: PostPosition = {
  currentHeading: null,
  currentPageIndex: null,
  totalPage: null,
  headingPageMapping: null,
};

const postPositionSlice = createSlice({
  name: 'currentHeading',
  initialState,
  reducers: {
    setCurrentHeading: (state, action: PayloadAction<Heading | null>) => {
      state.currentHeading = action.payload;
    },
    setCurrentPageIndex: (state, action: PayloadAction<number | null>) => {
      state.currentPageIndex = action.payload;
    },
    setTotalPage: (state, action: PayloadAction<number | null>) => {
      state.totalPage = action.payload;
    },
    nextPage: state => {
      state.currentPageIndex = state.currentPageIndex! + 1;
    },
    previousPage: state => {
      state.currentPageIndex = state.currentPageIndex! - 1;
    },
    setHeadingPageMapping: (
      state,
      action: PayloadAction<HeadingPageMapping | null>
    ) => {
      state.headingPageMapping = action.payload;
    },
  },
});

export default postPositionSlice.reducer;
export const {
  setCurrentHeading,
  setCurrentPageIndex,
  setTotalPage,
  nextPage,
  previousPage,
  setHeadingPageMapping,
} = postPositionSlice.actions;
