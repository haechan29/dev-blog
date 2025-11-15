import Heading from '@/features/post/domain/model/heading';
import PostReader from '@/features/post/domain/model/postReader';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: PostReader = {
  mode: 'parsed',
  currentHeading: null,
};

const postReaderSlice = createSlice({
  name: 'postReader',
  initialState,
  reducers: {
    setMode: (state, action: PayloadAction<PostReader['mode']>) => {
      state.mode = action.payload;
    },
    setCurrentHeading: (state, action: PayloadAction<Heading>) => {
      state.currentHeading = action.payload;
    },
  },
});

export default postReaderSlice.reducer;
export const { setMode, setCurrentHeading } = postReaderSlice.actions;
