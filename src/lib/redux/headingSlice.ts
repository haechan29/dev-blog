import Heading from '@/features/post/domain/model/heading';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState = {
  selectedHeading: null as Heading | null,
};

const headingSlice = createSlice({
  name: 'currentHeading',
  initialState,
  reducers: {
    selectHeading: (state, action: PayloadAction<Heading | null>) => {
      state.selectedHeading = action.payload;
    },
  },
});

export default headingSlice.reducer;
export const { selectHeading } = headingSlice.actions;
