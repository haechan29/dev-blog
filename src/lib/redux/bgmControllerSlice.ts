import { BgmController } from '@/features/post/domain/model/bgmController';
import { Position } from '@/types/position';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: BgmController = {
  isPlaying: false,
  isError: false,
  isWaiting: false,
  isReady: false,
  isVideoVisible: false,
  currentVideoId: null,
  position: null,
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
    hideVideo: state => {
      state.isVideoVisible = false;
    },
    setPosition: (state, action: PayloadAction<Position>) => {
      state.position = action.payload;
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
  hideVideo,
  setPosition,
  setRequestedBgm,
  clearRequestedBgm,
} = bgmControllerSlice.actions;
