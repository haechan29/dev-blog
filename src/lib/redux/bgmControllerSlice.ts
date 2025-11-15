import { BgmController } from '@/features/post/domain/model/bgmController';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: BgmController = {
  videoId: null,
  start: null,
  isPlaying: false,
  isError: false,
  isWaiting: false,
  isReady: false,
};

const bgmControllerSlice = createSlice({
  name: 'bgmController',
  initialState,
  reducers: {
    setVideoId: (state, action: PayloadAction<string>) => {
      state.videoId = action.payload;
    },
    setStart: (state, action: PayloadAction<number>) => {
      state.start = action.payload;
    },
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
  },
});

export default bgmControllerSlice.reducer;
export const {
  setVideoId,
  setStart,
  setIsPlaying,
  setIsError,
  setIsWaiting,
  setIsReady,
} = bgmControllerSlice.actions;
