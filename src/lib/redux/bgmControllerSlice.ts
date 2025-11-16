import { BgmController } from '@/features/post/domain/model/bgmController';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: BgmController = {
  isPlaying: false,
  isError: false,
  isWaiting: false,
  isReady: false,
  isVideoVisible: false,
  currentVideoId: null,
  currentContainerId: null,
  requestedBgm: {
    videoId: null,
    start: null,
    containerId: null,
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
    clearController: state => {
      state.isPlaying = false;
      state.isError = false;
      state.isWaiting = false;
      state.isReady = false;
      state.isVideoVisible = false;
    },
    toggleIsVideoVisible: state => {
      state.isVideoVisible = !state.isVideoVisible;
    },
    hideVideo: state => {
      state.isVideoVisible = false;
    },
    setRequestedBgm: (
      state,
      action: PayloadAction<BgmController['requestedBgm']>
    ) => {
      state.requestedBgm = action.payload;
    },
    clearRequestedBgm: state => {
      state.currentVideoId = state.requestedBgm.videoId;
      state.currentContainerId = state.requestedBgm.containerId;
      state.requestedBgm = {
        videoId: null,
        start: null,
        containerId: null,
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
  clearController,
  toggleIsVideoVisible,
  hideVideo,
  setRequestedBgm,
  clearRequestedBgm,
} = bgmControllerSlice.actions;
