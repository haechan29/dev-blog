import PostReader from '@/features/post/domain/model/postReader';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: PostReader = {
  mode: 'parsed',
};

const postReaderSlice = createSlice({
  name: 'postReader',
  initialState,
  reducers: {
    setMode: (state, action: PayloadAction<PostReader['mode']>) => {
      state.mode = action.payload;
    },
  },
});

export default postReaderSlice.reducer;
export const { setMode } = postReaderSlice.actions;
