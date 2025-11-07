import { WritePostContentToolbar } from '@/features/write/domain/model/writePostContentToolbar';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: WritePostContentToolbar = {
  canTouch: false,
  keyboardHeight: 0,
};

const contentToolbarSlice = createSlice({
  name: 'contentToolbar',
  initialState,
  reducers: {
    setCanTouch: (state, action: PayloadAction<boolean>) => {
      state.canTouch = action.payload;
    },
    setKeyboardHeight: (state, action: PayloadAction<number>) => {
      state.keyboardHeight = action.payload;
    },
  },
});

export default contentToolbarSlice.reducer;
export const { setCanTouch, setKeyboardHeight } = contentToolbarSlice.actions;
