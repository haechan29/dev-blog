import { WritePostContentToolbar } from '@/features/write/domain/model/writePostContentToolbar';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: WritePostContentToolbar = {
  isEditorFocused: false,
  canTouch: false,
  keyboardHeight: 0,
};

const contentToolbarSlice = createSlice({
  name: 'contentToolbar',
  initialState,
  reducers: {
    setIsEditorFocused: (state, action: PayloadAction<boolean>) => {
      state.isEditorFocused = action.payload;
    },
    setCanTouch: (state, action: PayloadAction<boolean>) => {
      state.canTouch = action.payload;
    },
    setKeyboardHeight: (state, action: PayloadAction<number>) => {
      state.keyboardHeight = action.payload;
    },
  },
});

export default contentToolbarSlice.reducer;
export const { setIsEditorFocused, setCanTouch, setKeyboardHeight } =
  contentToolbarSlice.actions;
