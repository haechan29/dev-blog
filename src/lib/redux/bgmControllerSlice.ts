import { BgmController } from '@/features/post/domain/model/bgmController';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: BgmController = {
  isPlaying: false,
  isError: false,
  isWaiting: false,
  isReady: false,
  action: null,
};

const bgmControllerSlice = createSlice({
  name: 'bgmController',
  initialState,
  reducers: {
    setIsPlaying: (state, action: PayloadAction<boolean>) => {
      state.isPlaying = action.payload;
    },
    setIsError: (state, action: PayloadAction<boolean>) => {
      state.isError = action.payload;
    },
    setIsWaiting: (state, action: PayloadAction<boolean>) => {
      state.isWaiting = action.payload;
    },
    setIsReady: (state, action: PayloadAction<boolean>) => {
      state.isReady = action.payload;
    },
    setAction: (state, action: PayloadAction<BgmController['action']>) => {
      state.action = action.payload;
    },
  },
});

export default bgmControllerSlice.reducer;
export const { setIsPlaying, setIsError, setIsWaiting, setIsReady, setAction } =
  bgmControllerSlice.actions;
