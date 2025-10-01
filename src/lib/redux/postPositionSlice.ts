import Heading from '@/features/post/domain/model/heading';
import PostPosition from '@/features/post/domain/model/postPosition';
import {
  getHeadingsByPage,
  getPageByHeadingId,
  HeadingPageMapping,
} from '@/features/postViewer/domain/types/headingPageMapping';
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

      // sync current page index with current heading
      if (!action.payload || !state.headingPageMapping) return;
      const page = getPageByHeadingId(
        state.headingPageMapping,
        action.payload.id
      );
      if (page === undefined) return;
      state.currentPageIndex = page;
    },
    setCurrentPageIndex: (state, action: PayloadAction<number | null>) => {
      state.currentPageIndex = action.payload;

      // sync current heading with current page index
      if (action.payload === null || !state.headingPageMapping) return;
      const headings = getHeadingsByPage(
        state.headingPageMapping,
        action.payload
      );
      if (!headings || headings.length === 0) return;
      state.currentHeading = headings[0];
    },
    setTotalPage: (state, action: PayloadAction<number | null>) => {
      state.totalPage = action.payload;
    },
    nextPage: state => {
      state.currentPageIndex = state.currentPageIndex! + 1;

      // sync current heading with current page index
      if (!state.headingPageMapping) return;
      const headings = getHeadingsByPage(
        state.headingPageMapping,
        state.currentPageIndex!
      );
      if (!headings || headings.length === 0) return;
      state.currentHeading = headings[0];
    },
    previousPage: state => {
      state.currentPageIndex = state.currentPageIndex! - 1;

      // sync current heading with current page index
      if (!state.headingPageMapping) return;
      const headings = getHeadingsByPage(
        state.headingPageMapping,
        state.currentPageIndex!
      );
      if (!headings || headings.length === 0) return;
      state.currentHeading = headings[0];
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
