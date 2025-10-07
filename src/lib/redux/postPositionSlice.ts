import Heading from '@/features/post/domain/model/heading';
import PostPosition, {
  syncHeadingWithPage,
  syncPageWithHeading,
} from '@/features/post/domain/model/postPosition';
import { HeadingPageMapping } from '@/features/postViewer/domain/types/headingPageMapping';
import { Pagination } from '@/features/postViewer/domain/types/pagination';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: PostPosition = {
  currentHeading: null,
  pagination: null,
  headingPageMapping: null,
};

const postPositionSlice = createSlice({
  name: 'currentHeading',
  initialState,
  reducers: {
    setCurrentHeading: (state, action: PayloadAction<Heading | null>) => {
      state.currentHeading = action.payload;

      const postPosition = syncPageWithHeading(state);
      if (postPosition) state.pagination = postPosition.pagination;
    },
    setPagination: (state, action: PayloadAction<Pagination | null>) => {
      state.pagination = action.payload;

      const postPosition = syncHeadingWithPage(state);
      if (postPosition) state.currentHeading = postPosition.currentHeading;
    },
    setCurrentPageIndex: (state, action: PayloadAction<number>) => {
      state.pagination = {
        ...state.pagination!,
        current: action.payload,
      };

      const postPosition = syncHeadingWithPage(state);
      if (postPosition) state.currentHeading = postPosition.currentHeading;
    },
    nextPage: state => {
      state.pagination = {
        ...state.pagination!,
        current: state.pagination!.current + 1,
      };

      const postPosition = syncHeadingWithPage(state);
      if (postPosition) state.currentHeading = postPosition.currentHeading;
    },
    previousPage: state => {
      state.pagination = {
        ...state.pagination!,
        current: state.pagination!.current - 1,
      };

      const postPosition = syncHeadingWithPage(state);
      if (postPosition) state.currentHeading = postPosition.currentHeading;
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
  setPagination,
  setCurrentPageIndex,
  nextPage,
  previousPage,
  setHeadingPageMapping,
} = postPositionSlice.actions;
