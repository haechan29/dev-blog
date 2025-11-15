import { BgmController } from '@/features/post/domain/model/bgmController';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: BgmController = {
  isPlaying: false,
  isError: false,
  isWaiting: false,
  isReady: false,
  isVideoVisible: false,
  currentVideoId: null,
  requestedBgm: {
    videoId: null,
    start: null,
  },
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
    toggleIsVideoVisible: state => {
      state.isVideoVisible = !state.isVideoVisible;
    },
    setRequestedBgm: (
      state,
      action: PayloadAction<BgmController['requestedBgm']>
    ) => {
      state.requestedBgm = action.payload;
    },
    clearRequestedBgm: state => {
      state.currentVideoId = state.requestedBgm.videoId;
      state.requestedBgm = {
        videoId: null,
        start: null,
      };
    },
  },
});

export default bgmControllerSlice.reducer;
export const {
  setIsPlaying,
  setIsError,
  setIsWaiting,
  setIsReady,
  toggleIsVideoVisible,
  setRequestedBgm,
  clearRequestedBgm,
} = bgmControllerSlice.actions;
